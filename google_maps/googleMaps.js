import axios from "axios";

export const address = (req,res) => {
    const address = 'K142/4 Lê Văn Hiến, Khuê Mỹ, Ngũ Hành Sơn, Đà Nẵng';
    const city = 'Đà Nẵng';
    const API_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}, ${city}&key=AIzaSyBVmZNRIzaIx8IpXwXeLeHYeXPAu6SaR0U`;
    axios(API_URL)

  .then(response  => {
    const data = response.data;
    console.log(data);
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const formattedAddress = result.formatted_address;
      console.log('Địa chỉ đầy đủ:', formattedAddress);

      // Lấy các thành phần của địa chỉ
      for (const component of result.address_components) {
        console.log(component.types[0], component.long_name);
      }

      res.status(201).send("OK");
    } else {
      console.error('Không tìm thấy địa chỉ.');
      res.status(500).send("Error ");
    }
  })
  .catch(error => {
    console.error('Lỗi:', error);
    res.status(500).send("Error ");
  });
}