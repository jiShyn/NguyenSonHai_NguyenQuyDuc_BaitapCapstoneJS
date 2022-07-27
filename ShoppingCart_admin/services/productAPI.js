var baseUrl = "https://6299dac16f8c03a9784b5a5e.mockapi.io/api/Products";

// Hàm call API lấy danh sách sản phẩm
function apiGetProducts(search) {
  return axios({
    url: baseUrl,
    method: "GET",
    params: {
      name: search,  
    },
  });
}
//

// Hàm call API thêm sản phẩm
function apiAddProduct(product) {
  return axios({
    url: baseUrl,
    method: "POST",
    data: product,  
  });
}

// Hàm call API xoá sản phẩm
function apiDeleteProduct(productId) {
  return axios({
    url: `${baseUrl}/${productId}`,
    method: "DELETE",
  });
}

// Hàm call API lấy chi tiết sản phẩm
function apiGetProductDetail(productId) {
  return axios({
    url: `${baseUrl}/${productId}`,
    method: "GET",
  });
}

// Hàm call API cập nhật sản phẩm
function apiUpdateProduct(product) {
  return axios({
    url: `${baseUrl}/${product.id}`,
    data: product,
    method: "PUT",
  });
}
