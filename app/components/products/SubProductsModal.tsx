import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import type { ISubProducts } from "../../types/interfaces/products.interface";
import { useImage } from "../../api/gallery.api";

interface SubProductsModalProps {
  open: boolean;
  onClose: () => void;
  subProducts: ISubProducts[];
}

const SubProductsModal: React.FC<SubProductsModalProps> = ({
  open,
  onClose,
  subProducts,
}) => {
  const { data: imageData } = useImage(
    subProducts.map((p) => p.imageId as number)
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2">
          Sub-Products
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img
                      src={
                        imageData?.find((i) => i.id === p.imageId)?.url ?? ""
                      }
                      alt="sub product"
                      width={50}
                    />
                  </TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default SubProductsModal;