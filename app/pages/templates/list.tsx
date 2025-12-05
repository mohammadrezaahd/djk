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
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Storage as AttributesIcon,
  Description as DetailsIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { useAttrs, useRemoveAttr } from "~/api/attributes.api";
import { useDetails, useRemoveDetail } from "~/api/details.api";
import type { ITemplateList } from "~/types/interfaces/templates.interface";
import AppLayout from "~/components/layout/AppLayout";
import {
  PageSizeSelector,
  PaginationControls,
  SearchInput,
  TitleCard,
} from "~/components/common";

type TemplateType = "attributes" | "details";

const TemplatesList = () => {
  // State for pagination and filters
  const [templateType, setTemplateType] = useState<TemplateType>("details");
  const [attributesPage, setAttributesPage] = useState<number>(1);
  const [detailsPage, setDetailsPage] = useState<number>(1);
  const [attributesLimit, setAttributesLimit] = useState<number>(10);
  const [detailsLimit, setDetailsLimit] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<string>("");

  // Data state
  const [attributesList, setAttributesList] = useState<ITemplateList[]>([]);
  const [detailsList, setDetailsList] = useState<ITemplateList[]>([]);
  const [attributesTotal, setAttributesTotal] = useState<number>(0);
  const [detailsTotal, setDetailsTotal] = useState<number>(0);

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    type: TemplateType | null;
    title: string;
  }>({
    open: false,
    id: null,
    type: null,
    title: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // React Query mutations
  const {
    mutateAsync: getAttrList,
    isPending: isAttrFetching,
    error: attributesError,
  } = useAttrs();

  const {
    mutateAsync: getDetailsList,
    isPending: isDetailFetching,
    error: detailsError,
  } = useDetails();

  // Delete mutations
  const { mutateAsync: removeAttribute, isPending: isRemovingAttribute } =
    useRemoveAttr();

  const { mutateAsync: removeDetail, isPending: isRemovingDetail } =
    useRemoveDetail();

  // Calculate skip values based on current page
  const attributesSkip = (attributesPage - 1) * attributesLimit;
  const detailsSkip = (detailsPage - 1) * detailsLimit;

  // Fetch attributes data
  const fetchAttributes = async () => {
    try {
      const response = await getAttrList({
        skip: attributesSkip,
        limit: attributesLimit,
      });

      if (response.status === "true" && response.data?.list) {
        setAttributesList(response.data.list);
        // For now, we'll use the list length as total since total is not provided in API response
        setAttributesTotal(response.data.list.length);
      }
    } catch (error: any) {
      enqueueSnackbar(`خطا در دریافت لیست ویژگی‌ها: ${error.message}`, {
        variant: "error",
      });
    }
  };

  // Fetch details data
  const fetchDetails = async () => {
    try {
      const response = await getDetailsList({
        skip: detailsSkip,
        limit: detailsLimit,
      });

      if (response.status === "true" && response.data?.list) {
        setDetailsList(response.data.list);
        setDetailsTotal(response.data.list.length);
      }
    } catch (error: any) {
      enqueueSnackbar(`خطا در دریافت لیست اطلاعات: ${error.message}`, {
        variant: "error",
      });
    }
  };

  // Effect to fetch data when template type or pagination changes
  useEffect(() => {
    if (templateType === "attributes") {
      fetchAttributes();
    } else {
      fetchDetails();
    }
  }, [
    templateType,
    attributesPage,
    attributesLimit,
    detailsPage,
    detailsLimit,
  ]);

  // Handle template type change
  const handleTemplateTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: TemplateType
  ) => {
    if (newType !== null) {
      setTemplateType(newType);
    }
  };

  // Handle pagination change
  const handleAttributesPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setAttributesPage(value);
  };

  const handleDetailsPageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setDetailsPage(value);
  };

  // Handle limit change
  const handleAttributesLimitChange = (event: any) => {
    setAttributesLimit(event.target.value);
    setAttributesPage(1); // Reset to first page
  };

  const handleDetailsLimitChange = (event: any) => {
    setDetailsLimit(event.target.value);
    setDetailsPage(1); // Reset to first page
  };

  // Pagination handlers for the common components
  const handleAttributesPageChangeForPagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setAttributesPage(value);
  };

  const handleDetailsPageChangeForPagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setDetailsPage(value);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
    // Reset both pages when searching
    setAttributesPage(1);
    setDetailsPage(1);
  };

  // Handle edit and delete actions
  const handleEdit = (id: number, type: TemplateType) => {
    navigate(`/dashboard/templates/edit?id=${id}&type=${type}`);
  };

  const handleDelete = (id: number, type: TemplateType) => {
    const item =
      type === "attributes"
        ? attributesList.find((attr) => attr.id === id)
        : detailsList.find((detail) => detail.id === id);

    setDeleteDialog({
      open: true,
      id,
      type,
      title:
        item?.title ||
        `${type === "attributes" ? "ویژگی" : "اطلاعات"} انتخاب شده`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id || !deleteDialog.type) return;

    try {
      if (deleteDialog.type === "attributes") {
        await removeAttribute(deleteDialog.id);
        enqueueSnackbar("ویژگی با موفقیت حذف شد", { variant: "success" });
        // Refresh the attributes list
        await fetchAttributes();
      } else {
        await removeDetail(deleteDialog.id);
        enqueueSnackbar("اطلاعات با موفقیت حذف شد", { variant: "success" });
        // Refresh the details list
        await fetchDetails();
      }
    } catch (error: any) {
      enqueueSnackbar(
        `خطا در حذف ${deleteDialog.type === "attributes" ? "ویژگی" : "اطلاعات"}: ${error.message}`,
        { variant: "error" }
      );
    } finally {
      setDeleteDialog({ open: false, id: null, type: null, title: "" });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, id: null, type: null, title: "" });
  };

  // Handle refresh
  const handleRefresh = () => {
    if (templateType === "attributes") {
      fetchAttributes();
    } else {
      fetchDetails();
    }
  };

  // Get current data and loading state
  const currentData =
    templateType === "attributes" ? attributesList : detailsList;
  const isLoading =
    templateType === "attributes" ? isAttrFetching : isDetailFetching;
  const currentPage =
    templateType === "attributes" ? attributesPage : detailsPage;
  const currentLimit =
    templateType === "attributes" ? attributesLimit : detailsLimit;
  const currentTotal =
    templateType === "attributes" ? attributesTotal : detailsTotal;

  // Filter data based on search
  const filteredData = currentData.filter((item) => {
    if (
      searchValue &&
      !item.title.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / currentLimit);

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
            <Skeleton variant="rectangular" width={60} height={24} />
          </TableCell>
          <TableCell>
            <Box display="flex" gap={1}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <AppLayout title="مدیریت قالب‌ها">
      <Box sx={{ mb: 3 }}>
        <TitleCard
          title="مدیریت قالب ها"
          description="مشاهده و مدیریت قالب‌های ویژگی‌ها و اطلاعات"
        />
      </Box>
      <Container maxWidth="lg">
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
                <ToggleButtonGroup
                  value={templateType}
                  exclusive
                  onChange={handleTemplateTypeChange}
                  aria-label="template type"
                  size="small"
                  dir="ltr"
                >
                  <ToggleButton value="attributes" aria-label="attributes">
                    <AttributesIcon sx={{ mr: 1 }} />
                    ویژگی‌ها
                  </ToggleButton>
                  <ToggleButton value="details" aria-label="details">
                    <DetailsIcon sx={{ mr: 1 }} />
                    اطلاعات
                  </ToggleButton>
                </ToggleButtonGroup>

                <PageSizeSelector
                  value={currentLimit}
                  onChange={
                    templateType === "attributes"
                      ? handleAttributesLimitChange
                      : handleDetailsLimitChange
                  }
                  options={[5, 10, 20, 50]}
                />

                <SearchInput
                  onSearchChange={handleSearchChange}
                  label="جستجو در قالب‌ها"
                  placeholder="نام قالب را جستجو کنید..."
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
                  {searchValue && ` از ${currentTotal}`}
                </Typography>
              </Box>
            </Box>

            {/* Error Display */}
            {(attributesError || detailsError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                خطا در دریافت اطلاعات:{" "}
                {attributesError?.message || detailsError?.message}
              </Alert>
            )}

            {/* Table */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>شناسه</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>عنوان</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>دسته‌بندی</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>منبع</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
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
                        <TableCell>{item.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.category_title}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.source}
                            size="small"
                            color="primary"
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
                                onClick={() =>
                                  handleEdit(item.id, templateType)
                                }
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleDelete(item.id, templateType)
                                }
                                disabled={
                                  isRemovingAttribute || isRemovingDetail
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          {searchValue
                            ? "نتیجه‌ای یافت نشد"
                            : "هیچ قالبی یافت نشد"}
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
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredData.length}
                onPageChange={
                  templateType === "attributes"
                    ? handleAttributesPageChangeForPagination
                    : handleDetailsPageChangeForPagination
                }
                disabled={isLoading}
              />
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          تایید حذف {deleteDialog.type === "attributes" ? "ویژگی" : "اطلاعات"}
        </DialogTitle>
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
            disabled={isRemovingAttribute || isRemovingDetail}
          >
            {isRemovingAttribute || isRemovingDetail ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
};

export default TemplatesList;
