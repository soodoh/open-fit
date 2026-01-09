"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Exercise } from "@/lib/convex-types";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Dumbbell, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const EXERCISES_PAGE_SIZE = 24;

export default function Exercises() {
  return (
    <AuthGuard>
      <ExercisesContent />
    </AuthGuard>
  );
}

type SearchState = {
  cursor: string | undefined;
  results: Exercise[];
  isDone: boolean;
  totalCount: number | undefined;
  lastProcessedCursor: string | undefined;
};

const initialSearchState: SearchState = {
  cursor: undefined,
  results: [],
  isDone: false,
  totalCount: undefined,
  lastProcessedCursor: undefined,
};

function ExercisesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Search pagination state - combined to avoid cascading renders
  const [searchState, setSearchState] =
    useState<SearchState>(initialSearchState);

  // Debounce search query and reset search pagination
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      // Reset search pagination when search term changes
      setSearchState(initialSearchState);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get total count of exercises
  const totalCount = useQuery(api.queries.exercises.count);

  // Use paginated query for listing exercises
  const {
    results: exercises,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.exercises.list,
    {},
    { initialNumItems: EXERCISES_PAGE_SIZE },
  );

  // Search query with manual cursor-based pagination
  const searchResponse = useQuery(
    api.queries.exercises.search,
    debouncedSearch.trim()
      ? {
          searchTerm: debouncedSearch,
          cursor: searchState.cursor,
          numItems: EXERCISES_PAGE_SIZE,
        }
      : "skip",
  );

  // Accumulate search results when new page arrives
  // Track the last processed cursor to detect new pages
  const lastProcessedCursorRef = useRef<string | undefined | null>(null);

  useEffect(() => {
    if (!searchResponse) return;

    // Check if this is a new response we haven't processed yet
    const currentCursor = searchState.cursor;
    if (lastProcessedCursorRef.current === currentCursor) return;

    lastProcessedCursorRef.current = currentCursor;
    const isFirstPage = currentCursor === undefined;

    setSearchState((prev) => ({
      ...prev,
      results: isFirstPage
        ? searchResponse.page
        : [...prev.results, ...searchResponse.page],
      isDone: searchResponse.isDone,
      totalCount: isFirstPage ? searchResponse.totalCount : prev.totalCount,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally only run when searchResponse changes
  }, [searchResponse]);

  // Load more search results
  const loadMoreSearch = useCallback(() => {
    if (searchResponse?.continueCursor && !searchState.isDone) {
      setSearchState((prev) => ({
        ...prev,
        cursor: searchResponse.continueCursor ?? undefined,
      }));
    }
  }, [searchResponse, searchState.isDone]);

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (debouncedSearch.trim()) {
            // Search mode - load more search results
            if (!searchState.isDone && searchResponse?.continueCursor) {
              loadMoreSearch();
            }
          } else {
            // Browse mode - load more from list
            if (status === "CanLoadMore") {
              loadMore(EXERCISES_PAGE_SIZE);
            }
          }
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [
    status,
    loadMore,
    debouncedSearch,
    searchState.isDone,
    searchResponse?.continueCursor,
    loadMoreSearch,
  ]);

  // Filter exercises client-side for muscle/category search (since search index only covers name)
  const displayExercises = useMemo(() => {
    if (debouncedSearch.trim()) {
      // When searching, use search results and also filter by muscle/category client-side
      if (searchState.results.length === 0 && searchResponse === undefined)
        return undefined;
      const query = debouncedSearch.toLowerCase().trim();

      // Also check if any loaded exercises match by muscle/category
      const muscleMatches =
        exercises?.filter(
          (exercise) =>
            !searchState.results.some((r) => r._id === exercise._id) &&
            (exercise.primaryMuscles.some((muscle) =>
              muscle.toLowerCase().includes(query),
            ) ||
              exercise.category.toLowerCase().includes(query)),
        ) || [];

      return [...searchState.results, ...muscleMatches];
    }
    return exercises;
  }, [exercises, searchState.results, debouncedSearch, searchResponse]);

  const isLoading = debouncedSearch.trim()
    ? searchResponse === undefined && searchState.results.length === 0
    : status === "LoadingFirstPage";

  const isLoadingMore = debouncedSearch.trim()
    ? searchState.cursor !== undefined && searchResponse === undefined
    : status === "LoadingMore";

  const canLoadMore = debouncedSearch.trim()
    ? !searchState.isDone
    : status === "CanLoadMore";

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-gradient-to-b from-accent/5 to-transparent">
        <Container maxWidth="xl" className="py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Exercises
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and discover exercises for your workouts
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, muscle, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container maxWidth="xl" className="py-8">
        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading &&
          exercises &&
          exercises.length === 0 &&
          !debouncedSearch && <EmptyState />}

        {/* No Search Results */}
        {!isLoading &&
          displayExercises &&
          displayExercises.length === 0 &&
          debouncedSearch.trim() && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                No exercises found
              </h3>
              <p className="text-muted-foreground text-center text-sm">
                No exercises match &quot;{debouncedSearch}&quot;
              </p>
            </div>
          )}

        {/* Results Count */}
        {displayExercises && displayExercises.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            {debouncedSearch ? (
              <>
                {searchState.totalCount !== undefined
                  ? `${searchState.totalCount} ${searchState.totalCount === 1 ? "exercise" : "exercises"} found`
                  : `${displayExercises.length} ${displayExercises.length === 1 ? "exercise" : "exercises"} found`}
              </>
            ) : (
              <>
                {totalCount} {totalCount === 1 ? "exercise" : "exercises"} total
              </>
            )}
          </p>
        )}

        {/* Exercises Grid */}
        {displayExercises && displayExercises.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayExercises.map((exercise) => (
              <ExerciseCard key={exercise._id} exercise={exercise} />
            ))}
          </div>
        )}

        {/* Infinite scroll sentinel & loading indicator */}
        {canLoadMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isLoadingMore && (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="h-48 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mb-6">
        <Dumbbell className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No exercises available
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        Exercise library is empty. Contact your administrator to seed the
        exercise database.
      </p>
    </div>
  );
}
