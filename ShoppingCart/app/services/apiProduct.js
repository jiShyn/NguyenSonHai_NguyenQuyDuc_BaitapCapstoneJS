const baseUrl = "https://6299dac16f8c03a9784b5a5e.mockapi.io/api/Products";

function apiGetProducts(typeSearch) {
   return axios({
      url: baseUrl,
      method: "GET",
      params: {
         type: typeSearch,
      },
   });
}
