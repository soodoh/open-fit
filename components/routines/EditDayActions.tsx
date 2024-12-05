import { useEffect, useState } from "react";
import { EditDayModal } from "./EditDayModal";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { DeleteDayModal } from "./DeleteDayModal";

enum Modal {
  EDIT = "edit",
  DELETE = "delete",
}

export const EditDayActions = ({
  workoutId,
  dayId,
}: {
  workoutId: number;
  dayId: number;
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
        workoutId={workoutId}
        dayId={dayId}
      />
      <DeleteDayModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        workoutId={workoutId}
        dayId={dayId}
      />
      <IconButton
        aria-label={`Edit actions for workout day ${dayId}`}
        id={`edit-day-actions-${dayId}`}
        aria-controls={menuOpen ? `edit-day-actions-${dayId}-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={`edit-day-actions-${dayId}-menu`}
        aria-labelledby={`edit-day-actions-${dayId}`}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableScrollLock
      >
        <MenuList>
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
