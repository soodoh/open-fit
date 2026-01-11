"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateSessionButton } from "@/components/sessions/CreateSession";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { CalendarDays, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SESSIONS_PAGE_SIZE = 12;

export default function Sessions() {
  return (
    <AuthGuard>
      <SessionsContent />
    </AuthGuard>
  );
}

function SessionsContent() {
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

  // Get total count of sessions (for browse mode)
  const totalCount = useQuery(api.queries.sessions.count);

  // Get count of search results (for search mode)
  const searchCount = useQuery(
    api.queries.sessions.searchCount,
    isSearching ? { searchTerm: debouncedSearch } : "skip",
  );

  // Paginated list for browse mode
  const {
    results: sessions,
    status: browseStatus,
    loadMore: loadMoreBrowse,
  } = usePaginatedQuery(
    api.queries.sessions.listPaginated,
    {},
    { initialNumItems: SESSIONS_PAGE_SIZE },
  );

  // Paginated search results
  const {
    results: searchResults,
    status: searchStatus,
    loadMore: loadMoreSearch,
  } = usePaginatedQuery(
    api.queries.sessions.search,
    isSearching ? { searchTerm: debouncedSearch } : "skip",
    { initialNumItems: SESSIONS_PAGE_SIZE },
  );

  const currentSession = useQuery(api.queries.sessions.getCurrent);

  // Determine which data to use based on search state
  const displaySessions = isSearching ? searchResults : sessions;
  const status = isSearching ? searchStatus : browseStatus;
  const loadMore = isSearching ? loadMoreSearch : loadMoreBrowse;

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(SESSIONS_PAGE_SIZE);
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
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Workout Logs
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your progress and review past sessions
              </p>
            </div>
            {sessions && sessions.length > 0 && <CreateSessionButton />}
          </div>

          {/* Search Bar */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sessions by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-8">
        {/* Resume Session Banner */}
        {currentSession && !isSearching && (
          <div className="mb-8">
            <ResumeSessionButton session={currentSession} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading && sessions && sessions.length === 0 && !isSearching && (
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
                No sessions found
              </h3>
              <p className="text-muted-foreground text-center text-sm">
                No sessions match &quot;{debouncedSearch}&quot;
              </p>
            </div>
          )}

        {/* Results Count */}
        {displaySessions && displaySessions.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            {isSearching ? (
              <>
                {searchCount} {searchCount === 1 ? "session" : "sessions"} found
              </>
            ) : (
              <>
                {totalCount} {totalCount === 1 ? "session" : "sessions"} total
              </>
            )}
          </p>
        )}

        {/* Sessions Grid */}
        {displaySessions && displaySessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySessions.map((session) => (
              <SessionSummaryCard
                key={session._id}
                session={session}
                isActive={session._id === currentSession?._id}
              />
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
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
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
        <CalendarDays className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No workout logs yet
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Start your first workout session to begin tracking your fitness journey.
        Log your exercises, track progress, and build consistent habits.
      </p>
      <CreateSessionButton />
    </div>
  );
}
