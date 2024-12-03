import useSWR from "swr";
import { useAuthFetcher } from "@/lib/fetcher";
import type { Setting } from "@/types/privateApi/setting";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export const WorkoutSetting = ({ setting }: { setting: Setting }) => {
  return (
    <ListItemButton sx={{ pl: 4 }}>
      <ListItemIcon>test</ListItemIcon>
      <ListItemText primary={setting.reps} />
    </ListItemButton>
  );
};
