"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Dumbbell, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EXERCISES_PAGE_SIZE = 24;

export default function Exercises() {
  return (
    <AuthGuard>
      <ExercisesContent />
    </AuthGuard>
  );
}

function ExercisesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = debouncedSearch.trim().length > 0;

  // Get total count of exercises (for browse mode)
  const totalCount = useQuery(api.queries.exercises.count);

  // Get count of search results (for search mode)
  const searchCount = useQuery(
    api.queries.exercises.searchCount,
    isSearching ? { searchTerm: debouncedSearch } : "skip",
  );

  // Paginated list for browse mode
  const {
    results: exercises,
    status: browseStatus,
    loadMore: loadMoreBrowse,
  } = usePaginatedQuery(
    api.queries.exercises.list,
    {},
    { initialNumItems: EXERCISES_PAGE_SIZE },
  );

  // Paginated search results
  const {
    results: searchResults,
    status: searchStatus,
    loadMore: loadMoreSearch,
  } = usePaginatedQuery(
    api.queries.exercises.search,
    isSearching ? { searchTerm: debouncedSearch } : "skip",
    { initialNumItems: EXERCISES_PAGE_SIZE },
  );

  // Determine which data to use based on search state
  const displayExercises = isSearching ? searchResults : exercises;
  const status = isSearching ? searchStatus : browseStatus;
  const loadMore = isSearching ? loadMoreSearch : loadMoreBrowse;

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(EXERCISES_PAGE_SIZE);
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
  }, [status, loadMore]);

  const isLoading = status === "LoadingFirstPage";
  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";

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
              placeholder="Search exercises by name..."
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
        {!isLoading && exercises && exercises.length === 0 && !isSearching && (
          <EmptyState />
        )}

        {/* No Search Results */}
        {!isLoading &&
          searchResults &&
          searchResults.length === 0 &&
          isSearching && (
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
            {isSearching ? (
              <>
                {searchCount} {searchCount === 1 ? "exercise" : "exercises"}{" "}
                found
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
