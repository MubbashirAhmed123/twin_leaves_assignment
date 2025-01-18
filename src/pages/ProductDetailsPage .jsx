import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ProductDetailsPage() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products`
      );
      const data = await response.json();
      console.log("Fetched data:", data.products); 

      const findProduct = data.products?.find((item) => item.sku_code === id);
      console.log("Found product:", findProduct); 

      if (findProduct) {
        setProduct(findProduct);
      } else {
        console.log("Product not found, setting dummy data");
        setProduct({}); 
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: "#f4f4f4" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const description = product?.description || "No description available. This is dummy content to fill the product info.";
  const name = product?.name || "Dummy Product Name";
  const price = product?.mrp?.mrp ? `₹${product.mrp.mrp}` : "₹0";
  const targetMarket = product?.mrp?.target_market || "Unknown";
  const location = product?.mrp?.location || "Not Available";
  const currency = product?.mrp?.currency || "INR";

  const columns = [
    {
      field: "field",
      headerName: "Product Info",
      width: 200,
      renderCell: (params) => (
        <div>
          <Typography variant="h6">{params.value}</Typography>
        </div>
      ),
    },
    {
      field: "value",
      headerName: "Details",
      width: 500,
      renderCell: (params) => (
        <div>
          <Typography>{params.value}</Typography>
        </div>
      ),
    },
  ];

  const rows = [
    { id: 1, field: "Name", value: name },
    { id: 2, field: "Price", value: price },
    { id: 3, field: "Description", value: description },
    { id: 4, field: "Target Market", value: targetMarket },
    { id: 5, field: "Location", value: location },
    { id: 6, field: "Currency", value: currency },
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f4f4f4" }}
    >
      <Box
        p={3}
        sx={{
          maxWidth: 1200,
          width: "100%",
          padding: { xs: "16px", sm: "24px", md: "32px" },
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Product Details
        </Typography>
        {product ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} container justifyContent="center">
              <img
                src={product.images?.front || "https://dummyimage.com/300"}
                alt={name}
                style={{
                  width: "80%",
                  height: "auto",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="h5">{name}</Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {price}
                </Typography>
              </Box>

              <Box
                sx={{
                  height: 400,
                  width: "100%",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  marginTop: 2,
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  hideFooter
                  rowHeight={40}
                  getRowId={(row) => row.id}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box mt={3}>
                <Typography variant="body1" paragraph>
                  {description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography>No product found</Typography>
        )}
      </Box>
    </Box>
  );
}

export default ProductDetailsPage;
