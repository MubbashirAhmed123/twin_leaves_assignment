import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortModel, setSortModel] = useState([{ field: 'price', sort: 'asc' }]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async (currentPage = 1) => {
    setLoading(true);
    setError(null); 
    try {
      const res = await fetch(
        `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products?page=${currentPage}`
      );
      
      if (!res.ok) {
        console.log("error while fetching.");
      }

      const data = await res.json();
      console.log(data.products);

      const mappedProducts = (data.products || []).map((product, index) => ({
        id: product.sku_code || index,
        name: product.name || "Unknown Product",
        price: product.mrp?.mrp ? parseFloat(product.mrp.mrp) : 0,
        category: product.main_category || "Unknown Category",
        images: product.images.front,
      }));

      setProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
      setRowCount(data.total || 0);

      const productCategories = [
        ...new Set(mappedProducts.map((product) => product.category)),
      ];
      setCategories(productCategories);
    } catch (error) {
      setError(error.message || "An error occurred while fetching the products.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    let filtered = [...products];

    if (searchQuery !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      filtered = filtered.sort((a, b) => {
        if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products, sortModel]);

  const columns = [
    {
      field: "images",
      headerName: "Image",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.value?.front || "https://dummyimage.com/300"}
          alt="Product"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "8px",
            objectFit: "cover",
            margin: "10px",
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 350,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: "bold" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: "semibold" }}>
          Rs {params.value.toFixed(2)}
        </Typography>
      ),
    },
  ];

  const handleRowClick = (rowData) => {
    navigate(`/product/${rowData.id}`);
  };

  return (
    <Box p={3} sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
        Products
      </Typography>

      <Box display="flex" gap={2} mb={2} sx={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ fontWeight: "bold" }}
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ fontWeight: "bold" }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            height: 600,
            width: "100%",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pageSize={10}
            loading={loading}
            rowCount={rowCount}
            paginationMode="server"
            onPageChange={(params) => setPage(params.page + 1)}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row.id}
            rowHeight={150}
            onRowClick={(params) => handleRowClick(params.row)}
            sortModel={sortModel}
            onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
          />
        </Box>
      )}
    </Box>
  );
}

export default ProductsPage;
