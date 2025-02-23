"use client";

import { type ReactNode, useEffect, useState } from "react";
import { EditDayModal } from "./EditDayModal";
import { Delete, Edit, PlayArrow } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { DeleteDayModal } from "./DeleteDayModal";
import type { RoutineDay, WorkoutSession } from "@prisma/client";
import { createSession } from "@/actions/createSession";
import { redirect } from "next/navigation";

enum Modal {
  EDIT = "edit",
  DELETE = "delete",
}

export const EditDayMenu = ({
  routineDay,
  currentSession,
  icon,
}: {
  routineDay: RoutineDay;
  currentSession: WorkoutSession | null;
  icon: ReactNode;
}) => {
  const [modal, setModal] = useState<Modal | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClose = () => setModal(null);

  useEffect(() => {
    if (modal) {
      setAnchorEl(null);
    }
  }, [modal]);

  return (
    <>
      <EditDayModal
        open={modal === Modal.EDIT}
        onClose={handleClose}
        routineDay={routineDay}
        routineId={routineDay.routineId}
      />
      <DeleteDayModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        dayId={routineDay.id}
      />

      <Menu
        id={`edit-day-actions-${routineDay.id}-menu`}
        aria-labelledby={`edit-day-actions-${routineDay.id}`}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableScrollLock
      >
        <MenuList dense disablePadding>
          <MenuItem
            onClick={async () => {
              await createSession({ templateId: routineDay.id });
              redirect("/logs/current");
            }}
            disabled={!!currentSession}
          >
            <ListItemIcon>
              <PlayArrow fontSize="small" />
            </ListItemIcon>
            <ListItemText>Start</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => setModal(Modal.EDIT)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => setModal(Modal.DELETE)}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>

      <IconButton
        aria-label={`Edit actions for workout day ${routineDay.id}`}
        id={`edit-day-actions-${routineDay.id}`}
        aria-controls={
          menuOpen ? `edit-day-actions-${routineDay.id}-menu` : undefined
        }
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        {icon}
      </IconButton>
    </>
  );
};
