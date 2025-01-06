"use client";

import { useEffect, useState } from "react";
import { DeleteRoutineModal } from "./DeleteRoutineModal";
import { EditRoutineModal } from "@/components/routines/EditRoutineModal";
import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { EditDayModal as AddDayModal } from "./EditDayModal";
import type { Routine } from "@prisma/client";

enum Modal {
  EDIT = "edit",
  ADD = "add",
  DELETE = "delete",
}

export const EditRoutineMenu = ({ routine }: { routine: Routine }) => {
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
      <AddDayModal
        open={modal === Modal.ADD}
        onClose={handleClose}
        routineId={routine.id}
      />
      <EditRoutineModal
        open={modal === Modal.EDIT}
        onClose={handleClose}
        routine={routine}
      />
      <DeleteRoutineModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        routineId={routine.id}
      />
      <IconButton
        aria-label={`Edit routine: ${routine.name}`}
        id={`edit-workout-actions-${routine.id}`}
        aria-controls={
          menuOpen ? `edit-workout-actions-${routine.id}-menu` : undefined
        }
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={`edit-workout-actions-${routine.id}-menu`}
        aria-labelledby={`edit-workout-actions-${routine.id}`}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableScrollLock
      >
        <MenuList disablePadding>
          <MenuItem onClick={() => setModal(Modal.ADD)}>
            <ListItemIcon>
              <Add fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Day</ListItemText>
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
    </>
  );
};
