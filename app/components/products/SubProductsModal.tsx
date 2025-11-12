import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import type { ISubProducts } from "~/types/interfaces/products.interface";
import { useImage } from "~/api/gallery.api";

interface SubProductsModalProps {
  open: boolean;
  onClose: () => void;
  productTitle: string;
  subProducts: ISubProducts[];
  isLoading: boolean;
}

const SubProductImage = ({ imageId }: { imageId: number }) => {
  const { data: imageData, isLoading } = useImage(imageId);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          bgcolor: "grey.300",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          ...
        </Typography>
      </Box>
    );
  }

  if (!imageData?.data?.image_url) {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          bgcolor: "grey.200",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          بدون تصویر
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={imageData.data.image_url}
      alt="تصویر محصول"
      sx={{
        width: 50,
        height: 50,
        objectFit: "cover",
        borderRadius: 1,
      }}
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect fill='%23ddd' width='50' height='50'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
      }}
    />
  );
};

const SubProductsModal: React.FC<SubProductsModalProps> = ({
  open,
  onClose,
  productTitle,
  subProducts,
  isLoading,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
      <DialogTitle>محصولات ساخته شده - {productTitle}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Typography>در حال بارگذاری...</Typography>
          </Box>
        ) : subProducts.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    شناسه
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    تصویر
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    عنوان
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    برند
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    منبع
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    وضعیت
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    فعال
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subProducts.map((subProduct) => (
                  <TableRow key={subProduct.id} hover>
                    <TableCell sx={{ textAlign: "right" }}>
                      {subProduct.id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {subProduct.images && subProduct.images.length > 0 ? (
                        <SubProductImage imageId={subProduct.images[0]} />
                      ) : (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            bgcolor: "grey.200",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            بدون تصویر
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography variant="body2" fontWeight="medium">
                        {subProduct.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {subProduct.brand || "-"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Chip
                        label={subProduct.source}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Chip
                        label={
                          subProduct.status === "publish"
                            ? "منتشر شده"
                            : "منتشر نشده"
                        }
                        size="small"
                        color={
                          subProduct.status === "publish" ? "success" : "default"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Chip
                        label={subProduct.active ? "فعال" : "غیرفعال"}
                        size="small"
                        color={subProduct.active ? "success" : "error"}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              هیچ محصول ساخته شده‌ای یافت نشد
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubProductsModal;
