import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Skeleton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import {
  useProducts,
  useRemoveProduct,
  usePublishProduct,
} from "~/api/product.api";
import type {
  IProductList,
  ProductStatus,
} from "~/types/interfaces/products.interface";
import AppLayout from "~/components/layout/AppLayout";
import {
  PageSizeSelector,
  PaginationControls,
  SearchInput,
  TitleCard,
} from "~/components/common";

const ProductsList = () => {
  // State for pagination and filters
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | undefined>(
    undefined
  );

  // Data state
  const [productsList, setProductsList] = useState<IProductList[]>([]);
  const [total, setTotal] = useState<number>(0);

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    title: string;
  }>({
    open: false,
    id: null,
    title: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // React Query mutations
  const {
    mutateAsync: getList,
    isPending: isLoading,
    error: fetchError,
  } = useProducts();

  // Delete mutation
  const { mutateAsync: removeProduct, isPending: isRemoving } =
    useRemoveProduct();

  // Publish mutation
  const { mutateAsync: publishProduct, isPending: isPublishing } =
    usePublishProduct();

  // Calculate skip value based on current page
  const skip = (page - 1) * limit;

  // Fetch products data
  const fetchProducts = async () => {
    try {
      const response = await getList({
        skip,
        limit,
        searchTerm: searchValue,
        categoryId,
        status: statusFilter,
      });

      if (response.status === "true" && response.data?.list) {
        setProductsList(response.data.list);
        setTotal(response.data.list.length);
      }
    } catch (error: any) {
      enqueueSnackbar(`خطا در دریافت لیست محصولات: ${error.message}`, {
        variant: "error",
      });
    }
  };

  // Effect to fetch data when filters or pagination changes
  useEffect(() => {
    fetchProducts();
  }, [page, limit, searchValue, categoryId, statusFilter]);

  // Handle pagination change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Handle limit change
  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
    setPage(1); // Reset to first page
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
    // Reset page when searching
    setPage(1);
  };

  // Handle edit action
  const handleEdit = (id: number) => {
    navigate(`/products/edit/${id}`);
  };

  // Handle delete action
  const handleDelete = (id: number) => {
    const item = productsList.find((product) => product.id === id);

    setDeleteDialog({
      open: true,
      id,
      title: item?.title || "محصول انتخاب شده",
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      await removeProduct(deleteDialog.id);
      enqueueSnackbar("محصول با موفقیت حذف شد", { variant: "success" });
      // Refresh the products list
      await fetchProducts();
    } catch (error: any) {
      enqueueSnackbar(`خطا در حذف محصول: ${error.message}`, {
        variant: "error",
      });
    } finally {
      setDeleteDialog({ open: false, id: null, title: "" });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, id: null, title: "" });
  };

  // Handle publish action
  const handlePublish = async (id: number) => {
    try {
      await publishProduct(id);
      enqueueSnackbar("محصول با موفقیت منتشر شد", { variant: "success" });
      // Refresh the products list
      await fetchProducts();
    } catch (error: any) {
      enqueueSnackbar(`خطا در انتشار محصول: ${error.message}`, {
        variant: "error",
      });
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchProducts();
  };

  // Get product status text
  const getStatusText = (status: ProductStatus): string => {
    const statusMap: Record<ProductStatus, string> = {
      0: "در انتظار انتشار",
      1: "در انتظار تایید",
      2: "در صف",
      3: "در حال پردازش",
      4: "تکمیل شده",
    };
    return statusMap[status] || "نامشخص";
  };

  // Get status color
  const getStatusColor = (
    status: ProductStatus
  ): "default" | "error" | "warning" | "info" | "success" => {
    const colorMap: Record<
      ProductStatus,
      "default" | "error" | "warning" | "info" | "success"
    > = {
      0: "error",
      1: "warning",
      2: "default",
      3: "info",
      4: "success",
    };
    return colorMap[status] || "default";
  };

  // Filter data based on current filters
  const filteredData = productsList.filter((item) => {
    if (
      searchValue &&
      !item.title.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return false;
    }
    if (categoryId !== undefined && item.category_id !== categoryId) {
      return false;
    }
    if (statusFilter !== undefined && item.user_status !== statusFilter) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / limit);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="text" width={60} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={200} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width={100} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={60} height={24} />
          </TableCell>
          <TableCell>
            <Box display="flex" gap={1}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <AppLayout title="مدیریت محصولات">
      <Box sx={{ mb: 3 }}>
        <TitleCard
          title="مدیریت محصولات"
          description="مشاهده و مدیریت محصولات"
        />
      </Box>

      <Card>
        <CardContent>
          {/* Filter and Controls */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <PageSizeSelector
                value={limit}
                onChange={handleLimitChange}
                options={[5, 10, 20, 50]}
              />

              <SearchInput
                onSearchChange={handleSearchChange}
                label="جستجو در محصولات"
                placeholder="نام محصول را جستجو کنید..."
                size="small"
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title="به‌روزرسانی">
                <IconButton onClick={handleRefresh} disabled={isLoading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                مجموع: {filteredData.length} مورد
                {searchValue && ` از ${total}`}
              </Typography>
            </Box>
          </Box>

          {/* Error Display */}
          {fetchError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              خطا در دریافت اطلاعات: {fetchError?.message}
            </Alert>
          )}

          {/* Table */}
          <TableContainer component={Paper} variant="outlined" dir="rtl">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    شناسه
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    عنوان
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    دسته‌بندی
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    منبع
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    وضعیت
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    عملیات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <LoadingSkeleton />
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ textAlign: "right" }}>
                        {item.id}
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        {item.category_id}
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Chip
                          label={item.source}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Chip
                          label={getStatusText(item.user_status)}
                          size="small"
                          color={getStatusColor(item.user_status)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Tooltip title="ویرایش">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(item.id)}
                              disabled={item.user_status !== 0}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(item.id)}
                              disabled={item.user_status !== 0 || isRemoving}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="انتشار">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handlePublish(item.id)}
                              disabled={item.user_status !== 0 || isPublishing}
                            >
                              <PublishIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {searchValue
                          ? "نتیجه‌ای یافت نشد"
                          : "هیچ محصولی یافت نشد"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredData.length > 0 && totalPages > 1 && (
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredData.length}
              onPageChange={handlePageChange}
              disabled={isLoading}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>تایید حذف محصول</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف "{deleteDialog.title}" اطمینان دارید؟
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            این عمل قابل بازگشت نیست.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            لغو
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isRemoving}
          >
            {isRemoving ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default ProductsList;
