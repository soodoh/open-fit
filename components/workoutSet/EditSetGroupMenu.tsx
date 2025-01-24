import { useEffect, useState } from "react";
import {
  Comment,
  Delete,
  MoreHoriz,
  Reorder,
  SquareFoot,
  Timer,
} from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { SetGroupWithSets } from "@/types/workoutSet";
import { EditSetCommentModal } from "./EditSetCommentModal";
import { DeleteSetGroupModal } from "../routines/DeleteSetGroupModal";

enum Modal {
  COMMENT = "comment",
  DELETE = "delete",
}

export const EditSetGroupMenu = ({
  setGroup,
  reorder,
  onReorder,
}: {
  setGroup: SetGroupWithSets;
  reorder: boolean;
  onReorder: () => void;
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
      <DeleteSetGroupModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        setGroup={setGroup}
      />
      <EditSetCommentModal
        open={modal === Modal.COMMENT}
        onClose={handleClose}
        setGroup={setGroup}
      />

      <Menu
        id={`edit-set-group-actions-${setGroup.id}-menu`}
        aria-labelledby={`edit-set-group-actions-${setGroup.id}`}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableScrollLock
      >
        <MenuList dense disablePadding>
          <MenuItem
            onClick={() => {
              onReorder();
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <Reorder fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {reorder ? "Hide Reorder" : "Show Reorder"}
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={() => setModal(Modal.COMMENT)}>
            <ListItemIcon>
              <Timer fontSize="small" />
            </ListItemIcon>
            <ListItemText>Set rest timer</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => setModal(Modal.COMMENT)}>
            <ListItemIcon>
              <SquareFoot fontSize="small" />
            </ListItemIcon>
            <ListItemText>Set rep/weight units</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => setModal(Modal.COMMENT)}>
            <ListItemIcon>
              <Comment fontSize="small" />
            </ListItemIcon>
            <ListItemText>Comment</ListItemText>
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
        aria-label={`Edit actions for set group ${setGroup.id}`}
        id={`edit-set-group-actions-${setGroup.id}`}
        aria-controls={
          menuOpen ? `edit-set-group-actions-${setGroup.id}-menu` : undefined
        }
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MoreHoriz />
      </IconButton>
    </>
  );
};
