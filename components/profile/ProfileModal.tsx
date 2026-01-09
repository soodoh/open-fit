"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";

export const ProfileModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const profileData = useQuery(api.queries.userProfiles.getCurrent);
  const updateProfile = useMutation(api.mutations.userProfiles.update);

  const [defaultRepUnitId, setDefaultRepUnitId] = useState<string>("");
  const [defaultWeightUnitId, setDefaultWeightUnitId] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens or profile data changes
  useEffect(() => {
    if (open && profileData) {
      // Use profile values if they exist, otherwise use first available unit
      const repUnitId =
        profileData.profile?.defaultRepetitionUnitId ??
        profileData.repetitionUnits.find((u) => u.name === "Repetitions")
          ?._id ??
        profileData.repetitionUnits[0]?._id ??
        "";
      const weightUnitId =
        profileData.profile?.defaultWeightUnitId ??
        profileData.weightUnits.find((u) => u.name === "lb")?._id ??
        profileData.weightUnits[0]?._id ??
        "";

      setDefaultRepUnitId(repUnitId);
      setDefaultWeightUnitId(weightUnitId);
      setError(null);
    }
  }, [open, profileData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!defaultRepUnitId || !defaultWeightUnitId) {
      setError("Please select both units");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      await updateProfile({
        defaultRepetitionUnitId: defaultRepUnitId as Id<"repetitionUnits">,
        defaultWeightUnitId: defaultWeightUnitId as Id<"weightUnits">,
      });
      onClose();
    } catch {
      setError("Failed to save profile settings");
    } finally {
      setIsPending(false);
    }
  };

  const isLoading = profileData === undefined;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header with gradient */}
          <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-br from-accent/10 via-transparent to-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Profile Settings</DialogTitle>
                <DialogDescription className="text-sm">
                  Customize your default preferences
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Form Content */}
          <div className="px-6 py-5 space-y-5">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="default-rep-unit"
                    className="text-sm font-medium"
                  >
                    Default Repetition Unit
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Used when adding new exercises to your workouts
                  </p>
                  <Select
                    value={defaultRepUnitId}
                    onValueChange={setDefaultRepUnitId}
                  >
                    <SelectTrigger id="default-rep-unit" className="h-11">
                      <SelectValue placeholder="Select repetition unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileData?.repetitionUnits.map((unit) => (
                        <SelectItem key={unit._id} value={unit._id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="default-weight-unit"
                    className="text-sm font-medium"
                  >
                    Default Weight Unit
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Used when logging weights in your workouts
                  </p>
                  <Select
                    value={defaultWeightUnitId}
                    onValueChange={setDefaultWeightUnitId}
                  >
                    <SelectTrigger id="default-weight-unit" className="h-11">
                      <SelectValue placeholder="Select weight unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileData?.weightUnits.map((unit) => (
                        <SelectItem key={unit._id} value={unit._id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <p className="text-sm text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {error}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isLoading}
              className="min-w-[100px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
