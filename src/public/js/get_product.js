document.addEventListener("DOMContentLoaded", async () => {
  const productInfo = document.getElementById("product-info");
  
  const path = window.location.pathname.split("/");
  const code = path[2];
  
  console.log("Full path:", window.location.pathname);
  console.log("Split path:", path);
  console.log("Product code:", code);

  if (!code) {
    productInfo.innerHTML = "<div style='color:red'>ProductID not found in URL</div>";
    return;
  }

  productInfo.innerHTML = "<p>Đang tải sản phẩm: " + code + "...</p>";

  try {
    const url = `/product/${code}`;
    console.log("Fetching:", url);
    
    const response = await fetch('http://localhost:4000/product/${code}');
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log("API result:", result);

    if (!result.success || !result.data) {
      productInfo.innerHTML = `<div style='color:orange'>Product not found: ${result.message || ''}</div>`;
      return;
    }

    const p = result.data;
    productInfo.innerHTML = `
      <h1>${p.ProductName}</h1>
      <p><strong>Dung tích:</strong> ${p.Volume || 'N/A'}</p>
      <p><strong>Giá:</strong> ${p.Price || 'N/A'}</p>
      <p><strong>Hạn sử dụng:</strong> ${p.ExpiryDate || 'N/A'}</p>
      
      <h3>Thành phần</h3>
      ${p.composition ? `
        <p>Khoáng chất: ${p.composition.MineralComposition}</p>
        <p>pH: ${p.composition.pHRange}</p>
      ` : "<p>Không có thông tin</p>"}
      
      <h3>Hướng dẫn bảo quản</h3>
      ${p.careInstructions?.length ? 
        p.careInstructions.map(item => `<p>• ${item.InstructionText}</p>`).join("") 
        : "<p>Không có hướng dẫn</p>"
      }
    `;
  } catch (err) {
    productInfo.innerHTML = `<div style='color:red'>Lỗi kết nối: ${err.message}</div>`;
    console.error("Fetch error:", err);
  }
});