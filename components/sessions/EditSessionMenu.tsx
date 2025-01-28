"use client";
import { useEffect, useState } from "react";
import { Delete, Edit, Settings } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { EditSessionModal } from "./EditSessionModal";
import { DeleteSessionModal } from "./DeleteSessionModal";
import type { SessionWithSets } from "@/types/workoutSession";

enum Modal {
  EDIT = "edit",
  DELETE = "delete",
}

export const EditSessionMenu = ({ session }: { session: SessionWithSets }) => {
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
      <DeleteSessionModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        sessionId={session.id}
      />

      <EditSessionModal
        open={modal === Modal.EDIT}
        onClose={handleClose}
        session={session}
      />

      <Menu
        id={`edit-session-actions-${session.id}-menu`}
        aria-labelledby={`edit-day-actions-${session.id}`}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableScrollLock
      >
        <MenuList dense disablePadding>
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
        aria-label={`Edit actions for workout session ${session.id}`}
        id={`edit-day-actions-${session.id}`}
        aria-controls={
          menuOpen ? `edit-day-actions-${session.id}-menu` : undefined
        }
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <Settings />
      </IconButton>
    </>
  );
};
