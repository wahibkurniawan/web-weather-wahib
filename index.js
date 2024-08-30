// ~Bagian 1: Mengosongkan Input dan Mereset Style Animasi saat Input Diklik
function clearInput() {
  const inputElem = document.getElementById("nama-kota");
  const mainElem = document.querySelector("main");
  const titleElem = document.querySelector(".title");
  const descElem = document.querySelector(".box-desc");
  const footerElem = document.querySelector("footer");
  const btnInfo = document.querySelector(".show-button");
  const containerElem = document.querySelector(".container");
  const weatherInfoDiv = document.getElementById("weatherInfo");

  //mengosongkan input
  inputElem.value = "";

  // menyembunyikan elemen yang tidak diperlukan
  weatherInfoDiv.style.display = "none";
  btnInfo.textContent = "Lihat Informasi Cuaca";
  mainElem.style.visibility = "hidden";
  titleElem.style.visibility = "hidden";
  descElem.style.visibility = "hidden";
  footerElem.style.visibility = "hidden";
  btnInfo.style.visibility = "hidden";

  // menghapus animasi sebelumnya, fungsinya supaya saat element ditampilkan kembali, animasi bisa diputar ulang.
  mainElem.classList.remove("fade-in");
  titleElem.classList.remove("fade-in");
  descElem.classList.remove("fade-in");
  footerElem.classList.remove("fade-in");
  containerElem.classList.remove("blur-background");

  // menambahkan event listener untuk input
  document.getElementById("nama-kota").addEventListener("input", function () {
    const inputVal = this.value.toLowerCase(); //this merujuk pada input yang menerima event, yaitu element dengan id 'nama-kota', lalu mengkonversi input menjadi huruf kecil, supaya pencarian bisa dilakukan dengan huruf besar atau kecil.
    const suggestions = kotaNames.filter(
      (kota) => kota.toLowerCase().startsWith(inputVal) //bagian ini memeriksa apakah nama kota (kota) yang telah dikonversi menjadi huruf kecil dimulai dengan teks yang diinput(inputVal).
    ); //metode startsWith() mengembalikan true jika teks kota dimulai dengan inputVal dan false jika tidak.

    const suggestionsList = document.getElementById("suggestions");
    suggestionsList.innerHTML = ""; // menghapus saran kota sebelumnya
    // hasil dari filter lalu disimpan dalam variabel suggestions, yang berisi daftar kota yang cocok dengan input pengguna..

    if (suggestions.length > 0 && inputVal !== "") {
      suggestionsList.style.display = "block"; //menampilkan kembali daftar kota
      suggestionsList.style.opacity = 1; //membuat terlihat tidak transparan
    } else {
      suggestionsList.style.display = "none"; //menyembunyikan daftar kota
    }
    // menampilkan saran kota berdasarkan input pengguna
    suggestions.forEach((suggestion) => {
      const li = document.createElement("li");
      li.textContent = suggestion;
      li.addEventListener("click", function () {
        document.getElementById("nama-kota").value = suggestion;
        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none";
      });
      suggestionsList.appendChild(li);
    });
    // menyembunyikan daftar saran kota saat halaman dimuat
    window.addEventListener("load", function () {
      const suggestionsList = document.getElementById("suggestions");
      suggestionsList.style.opacity = 0;
    });
  });
}
//~ Bagian 2: Mengambil Data Cuaca Berdasarkan Koordinat
async function fetchWeatherData(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Gagal mengambil data cuaca");
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}
//~ Bagian 3: Mencari Kota dan Menampilkan Hasil Cuaca
async function cariKota() {
  const namaKota = document.getElementById("nama-kota").value.trim();
  console.log(namaKota);
  const koordinat = kotaKoordinat[namaKota];
  console.log(koordinat);
  const loader = document.getElementById("loader");
  const containerElem = document.querySelector(".container");
  const weatherInfoDiv = document.getElementById("weatherInfo");
  const btnInfo = document.querySelector(".show-button");

  weatherInfoDiv.style.display = "none";
  btnInfo.textContent = "Lihat Informasi Cuaca";

  if (koordinat) {
    loader.style.display = "block";

    try {
      const cuacaKota = await fetchWeatherData(
        koordinat.latitude,
        koordinat.longitude
      );
      if (cuacaKota) {
        containerElem.classList.add("blur-background");
        document.getElementById("suggestions").innerHTML = "";
        document.getElementById("suggestions").style.display = "none";
        updateWeatherInfo(
          cuacaKota,
          namaKota,
          koordinat.latitude,
          koordinat.longitude
        );
      } else {
        alert("Data cuaca tidak tersedia. Silahkan Coba Lagi.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengambil data cuaca.");
    } finally {
      loader.style.display = "none";
    }
  } else {
    alert("Kota tidak ditemukan. Silakan pilih kota yang BENAR.");
  }
}

//~ Bagian 4: Koordinat Kota-Kota di Indonesia
const kotaKoordinat = {
  Jakarta: { latitude: -6.1818, longitude: 106.875 },
  Surabaya: { latitude: -7.2575, longitude: 112.7521 },
  Bandung: { latitude: -6.9175, longitude: 107.6191 },
  Medan: { latitude: 3.5952, longitude: 98.6722 },
  Semarang: { latitude: -6.9667, longitude: 110.4167 },
  Makassar: { latitude: -5.1476, longitude: 119.4327 },
  Yogyakarta: { latitude: -7.7975, longitude: 110.3695 },
  Palembang: { latitude: -2.9909, longitude: 104.7563 },
  Bali: { latitude: -8.3405, longitude: 115.092 },
  Balikpapan: { latitude: -1.2379, longitude: 95.3238 },
  Aceh: { latitude: 5.5483, longitude: 116.8529 },
  Papua: { latitude: -2.5337, longitude: 140.7181 },
  Maluku: { latitude: -3.6547, longitude: 128.1902 },
  Pekanbaru: { latitude: 0.5333, longitude: 101.45 },
  Padang: { latitude: -0.9492, longitude: 100.3543 },
  Palangkaraya: { latitude: -2.2081, longitude: 113.9166 },
  Banjarmasin: { latitude: -3.3244, longitude: 114.5917 },
  Manado: { latitude: 1.4748, longitude: 124.8428 },
  Ambon: { latitude: -3.7073, longitude: 128.1776 },
  Pontianak: { latitude: 0.0009, longitude: 109.3332 },
  Samarinda: { latitude: -0.5022, longitude: 117.1536 },
  Kupang: { latitude: -10.1772, longitude: 123.607 },
  Mataram: { latitude: -8.5833, longitude: 116.1167 },
  Jayapura: { latitude: -2.5337, longitude: 140.7177 },
  Gorontalo: { latitude: 0.5475, longitude: 123.0633 },
  Kendari: { latitude: -3.9985, longitude: 122.5129 },
  Ternate: { latitude: 0.7961, longitude: 127.3849 },
  Tidore: { latitude: 0.6929, longitude: 127.3881 },
  BandaAceh: { latitude: 5.5483, longitude: 95.3176 },
  Jambi: { latitude: -1.6105, longitude: 103.607 },
  Bengkulu: { latitude: -3.7956, longitude: 102.259 },
  PangkalPinang: { latitude: -2.1292, longitude: 106.1136 },
  TanjungPinang: { latitude: 0.9165, longitude: 104.4582 },
  BandarLampung: { latitude: -5.4297, longitude: 105.2615 },
  Serang: { latitude: -6.1205, longitude: 106.1505 },
  Cirebon: { latitude: -6.706, longitude: 108.5578 },
  Sukabumi: { latitude: -6.9219, longitude: 106.9263 },
  Tasikmalaya: { latitude: -7.3274, longitude: 108.2202 },
  Purwokerto: { latitude: -7.4244, longitude: 109.2396 },
  Cilacap: { latitude: -7.717, longitude: 109.0074 },
  Solo: { latitude: -7.5766, longitude: 110.8256 },
  Madiun: { latitude: -7.6293, longitude: 111.5239 },
  Mojokerto: { latitude: -7.4726, longitude: 112.4381 },
  Jember: { latitude: -8.1727, longitude: 113.6873 },
  Banyuwangi: { latitude: -8.2192, longitude: 114.3696 },
  Probolinggo: { latitude: -7.7508, longitude: 113.2153 },
  Malang: { latitude: -7.9666, longitude: 112.6326 },
  Pasuruan: { latitude: -7.6453, longitude: 112.9036 },
  Denpasar: { latitude: -8.6705, longitude: 115.2126 },
  Lombok: { latitude: -8.6505, longitude: 116.3249 },
  Sumbawa: { latitude: -8.5006, longitude: 117.4303 },
  Dompu: { latitude: -8.536, longitude: 118.4571 },
  Bima: { latitude: -8.4539, longitude: 118.7236 },
  Raba: { latitude: -8.4583, longitude: 118.7355 },
  Waingapu: { latitude: -9.6561, longitude: 120.2635 },
  LabuanBajo: { latitude: -8.4894, longitude: 119.8853 },
  Maumere: { latitude: -8.6195, longitude: 122.2117 },
  Ende: { latitude: -8.8562, longitude: 121.6607 },
  Ruteng: { latitude: -8.6072, longitude: 120.4692 },
  Larantuka: { latitude: -8.3434, longitude: 123.0416 },
  Bajawa: { latitude: -8.7601, longitude: 121.2299 },
  Kupang: { latitude: -10.1667, longitude: 123.583 },
  Atambua: { latitude: -9.1064, longitude: 124.8925 },
  SoE: { latitude: -9.8554, longitude: 124.2823 },
  Kalabahi: { latitude: -8.2167, longitude: 124.5167 },
  Sumba: { latitude: -9.6667, longitude: 119.0833 },
  Sabu: { latitude: -10.5167, longitude: 121.6667 },
  Rote: { latitude: -10.75, longitude: 123.0833 },
  Palu: { latitude: -0.8989, longitude: 119.8522 },
  Poso: { latitude: -1.3968, longitude: 120.754 },
  Tolitoli: { latitude: 1.0333, longitude: 120.8 },
  Luwuk: { latitude: -0.9515, longitude: 122.7957 },
  Gorontalo: { latitude: 0.5408, longitude: 123.0696 },
  Bitung: { latitude: 1.4451, longitude: 125.1825 },
  Kotamobagu: { latitude: 0.7161, longitude: 124.3086 },
  Ternate: { latitude: 0.7889, longitude: 127.3666 },
  Tobelo: { latitude: 1.712, longitude: 128.0044 },
  Sanana: { latitude: -2.0846, longitude: 125.9917 },
  Namlea: { latitude: -3.2464, longitude: 127.1061 },
  Tual: { latitude: -5.6255, longitude: 132.7497 },
  Saumlaki: { latitude: -7.9639, longitude: 131.2898 },
  Merauke: { latitude: -8.4932, longitude: 140.4014 },
  Wamena: { latitude: -4.1023, longitude: 138.9407 },
  Timika: { latitude: -4.55, longitude: 136.8833 },
  Biak: { latitude: -1.1741, longitude: 136.0841 },
  Nabire: { latitude: -3.3672, longitude: 135.4917 },
  Sorong: { latitude: -0.8762, longitude: 131.2558 },
  Manokwari: { latitude: -0.8616, longitude: 134.0626 },
  Fakfak: { latitude: -2.9277, longitude: 132.2963 },
  Kaimana: { latitude: -3.6551, longitude: 133.7683 },
  RajaAmpat: { latitude: -0.2333, longitude: 130.522 },
  Jayawijaya: { latitude: -4.0833, longitude: 138.0833 },
  TelukBintuni: { latitude: -2.1286, longitude: 133.4574 },
  TelukWondama: { latitude: -2.5113, longitude: 134.489 },
  Pontianak: { latitude: -0.0263, longitude: 109.3425 },
  Tanjungpinang: { latitude: 0.9168, longitude: 104.4498 },
  Ambon: { latitude: -3.6556, longitude: 128.1906 },
  Kendari: { latitude: -3.9954, longitude: 122.5151 },
  Palu: { latitude: -0.8917, longitude: 119.8707 },
  Mataram: { latitude: -8.5833, longitude: 116.1167 },
  Manado: { latitude: 1.4931, longitude: 124.8413 },
  PangkalPinang: { latitude: -2.1292, longitude: 106.1136 },
  Ternate: { latitude: 0.7893, longitude: 127.3801 },
  Tidore: { latitude: 0.6933, longitude: 127.4092 },
  Tarakan: { latitude: 3.3125, longitude: 117.5917 },
  Sidoarjo: { latitude: -7.4469, longitude: 112.7183 },
  Pekalongan: { latitude: -6.8898, longitude: 109.6753 },
  Kupang: { latitude: -10.1772, longitude: 123.607 },
  Biak: { latitude: -1.1783, longitude: 136.0893 },
  Timika: { latitude: -4.5444, longitude: 136.8884 },
};
//~ Bagian 5: Menerapkan Animasi pada Input dan Tombol
// menerapkan animasi pada input dan tombol setelah DOM siap atau saat pencarian selesai
function applyInputAnimation() {
  const inputElem = document.getElementById("nama-kota");
  const btnSearchElem = document.getElementById("btn-search");
  const btnInfoElem = document.querySelector(".show-button");

  inputElem.classList.add("fade-in");
  btnSearchElem.classList.add("fade-in");
  btnInfoElem.classList.add("fade-in");

  setTimeout(() => {
    inputElem.classList.remove("fade-in");
    btnSearchElem.classList.remove("fade-in");
    btnInfoElem.classList.remove("fade-in");
  }, 1500);
}

document.addEventListener("DOMContentLoaded", applyInputAnimation); //kode ini akan memastikan animasi tersebut diterapkan pada waktu yang tepat, yakni sesaat setelah elemen-elemen tersebut tersedia di DOM, tetapi sebelum seluruh halaman selesai di-load.

//~ Bagian 6: Menampilkan atau Menyembunyikan Informasi Cuaca saat Tombol Diklik
// menampilkan atau menyembunyikan informasi cuaca saat tombol diklik
function showWeatherInfo() {
  const weatherInfoDiv = document.getElementById("weatherInfo");
  const toggleButton = document.querySelector(".show-button");

  if (
    weatherInfoDiv.style.display === "none" ||
    weatherInfoDiv.style.display === ""
  ) {
    weatherInfoDiv.style.visibility = "visible";
    weatherInfoDiv.style.display = "block";
    toggleButton.textContent = "Sembunyikan Informasi";
  } else {
    weatherInfoDiv.style.display = "none";
    toggleButton.textContent = "Lihat Informasi Cuaca";
  }
}

//~ Bagian 7: Menambahkan Event Listener untuk Input Kota
const kotaNames = Object.keys(kotaKoordinat); //fungsi dari Object.keys() adalah fungsi bawaan JavaScript yang mengembalikan array yang berisi semua "key" atau "nama properti" dari suatu objek.
// menambahkan event listener untuk input kota
document.getElementById("nama-kota").addEventListener("input", function () {
  const inputVal = this.value.toLowerCase();
  const suggestions = kotaNames.filter((kota) =>
    kota.toLowerCase().startsWith(inputVal)
  );

  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.textContent = suggestion;
    li.addEventListener("click", function () {
      document.getElementById("nama-kota").value = suggestion;
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(li);
  });

  if (inputVal === "") {
    suggestionsList.innerHTML = "";
  }
});

//~ Bagian 8: Mengupdate Informasi Cuaca di UI
function updateWeatherInfo(cuacaKota, namaKota, latitude, longitude) {
  const mainElem = document.querySelector("main");
  const titleElem = document.querySelector(".title");
  const descElem = document.querySelector(".box-desc");
  const footerElem = document.querySelector("footer");
  const noAElement = document.querySelector(".no-a");
  const btnInfo = document.querySelector(".show-button");
  const containerElem = document.querySelector(".container");

  mainElem.style.visibility = "visible";
  titleElem.style.visibility = "visible";
  descElem.style.visibility = "visible";
  footerElem.style.visibility = "visible";
  btnInfo.style.visibility = "visible";

  containerElem.classList.add("blur-background");

  mainElem.classList.add("fade-in");
  titleElem.classList.add("fade-in");
  descElem.classList.add("fade-in");
  footerElem.classList.add("fade-in");
  btnInfo.classList.add("fade-in");

  setTimeout(() => {
    btnInfo.classList.remove("fade-in");
  }, 1500);

  const currentWeather = cuacaKota.current;
  console.log(currentWeather);
  const currentDate = currentWeather.time.split("T")[0];
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const currentDayName = days[new Date(currentDate).getDay()];

  const temperature = currentWeather.temperature_2m;
  const humidity = currentWeather.relative_humidity_2m;
  const windSpeed = currentWeather.wind_speed_10m;
  const windDirection = currentWeather.wind_direction_10m;

  // Menentukan kondisi cuaca mingguan
  let weatherCondition = "";
  cuacaKota.daily.time.forEach((hari, i) => {
    if (hari === currentDate) {
      const maxTemp = cuacaKota.daily.temperature_2m_max[i];
      const minTemp = cuacaKota.daily.temperature_2m_min[i];

      if (minTemp < 25 && maxTemp <= 28) {
        weatherCondition = "Hujan Lebat";
        noAElement.style.backgroundImage =
          "url(./assets/hujan-lebat-trans.gif)";
      } else if (minTemp >= 20 && minTemp < 25 && maxTemp <= 28) {
        weatherCondition = "Hujan";
        noAElement.style.backgroundImage = "url(./assets/rain-1-trans.gif)";
      } else if (minTemp >= 22 && minTemp < 25 && maxTemp <= 28) {
        weatherCondition = "Mendung Tebal";
        noAElement.style.backgroundImage = "url(./assets/wind-power-trans.gif)";
      } else if (minTemp >= 25 && maxTemp <= 30) {
        weatherCondition = "Mendung";
        noAElement.style.backgroundImage = "url(./assets/storm-2-trans.gif)";
      } else if (maxTemp > 35) {
        weatherCondition = "Panas Terik";
        noAElement.style.backgroundImage = "url(./assets/sun-2-trans.gif)";
      } else if (minTemp >= 25 && maxTemp > 30 && maxTemp <= 33) {
        weatherCondition = "Cerah";
        noAElement.style.backgroundImage = "url(./assets/sun-1-trans.gif)";
      } else if (minTemp >= 25 && maxTemp <= 30) {
        weatherCondition = "Berawan";
        noAElement.style.backgroundImage = "url(./assets/clouds-1-trans.gif)";
      } else if (minTemp >= 20 && maxTemp <= 30) {
        weatherCondition = "Mendung Berangin";
        noAElement.style.backgroundImage = "url(./assets/foggy-1-trans.gif)";
      } else if (minTemp >= 25 && maxTemp <= 33) {
        weatherCondition = "Cerah Berawan";
        noAElement.style.backgroundImage = "url(./assets/cloudy-trans.gif)";
      } else {
        weatherCondition = "Cerah";
        noAElement.style.backgroundImage = "url(./assets/sun-1-trans.gif)";
      }
    }
  });
  console.log(weatherCondition);

  // memperbarui informasi cuaca pada UI
  document.getElementById(
    "current-day"
  ).textContent = `Hari: ${currentDayName}`;
  document.getElementById("latitude").textContent = `Latitude: ${latitude}`;
  document.getElementById("longitude").textContent = `Longitude: ${longitude}`;
  document.getElementById(
    "current-time"
  ).textContent = `Waktu: ${currentWeather.time}`;
  document.getElementById(
    "weather-indicator"
  ).textContent = `Cuaca: ${weatherCondition}`;

  //membuat kondisi di bagian temperatur, humadity, wind speed dan wind direction
  const tempIndicator =
    temperature > 30 ? "Panas" : temperature < 20 ? "Dingin" : "Sejuk";
  const humidityIndicator =
    humidity > 80 ? "Lembap" : humidity < 40 ? "Kering" : "Normal";
  const windSpeedIndicator =
    windSpeed > 15 ? "Kencang" : windSpeed < 5 ? "Lambat" : "Sedang";
  const windDirectionIndicator =
    windDirection >= 315 || windDirection < 45
      ? "Utara"
      : windDirection >= 45 && windDirection < 135
      ? "Timur"
      : windDirection >= 135 && windDirection < 225
      ? "Selatan"
      : "Barat";

  document.querySelector(".no1").innerHTML = `<h4>Suhu °C</h4><p>${temperature} °C (${tempIndicator})</p>`;
  document.querySelector(".no2").innerHTML = `<h4>Kelembapan</h4><p>${humidity} % (${humidityIndicator})</p>`;
  document.querySelector(".no3").innerHTML = `<h4>Arah Angin</h4><p>${windDirection} ° (${windDirectionIndicator})</p>`;
  document.querySelector(".no4").innerHTML = `<h4>Kecepatan Angin</h4><p>${windSpeed} km/h (${windSpeedIndicator})</p>`;

  // mengelola tampilan cuaca harian
  const dailyElements = document.querySelectorAll(".daily");
  cuacaKota.daily.time.forEach((hari, i) => {
    if (dailyElements[i]) {
      const maxTemp = cuacaKota.daily.temperature_2m_max[i];
      const minTemp = cuacaKota.daily.temperature_2m_min[i];
      let forecastCondition = "";
      //membuat kondisi untuk cuaca harian
      if (minTemp < 25 && maxTemp <= 28) {
        forecastCondition = "Hujan Lebat";
        dailyElements[i].style.backgroundImage =
          "url(./assets/hujan-lebat-trans.gif)";
      } else if (minTemp >= 20 && minTemp < 25 && maxTemp <= 28) {
        forecastCondition = "Hujan";
        dailyElements[i].style.backgroundImage =
          "url(./assets/rain-1-trans.gif)";
      } else if (minTemp >= 22 && minTemp < 25 && maxTemp <= 28) {
        forecastCondition = "Mendung Tebal";
        dailyElements[i].style.backgroundImage =
          "url(./assets/wind-power-trans.gif)";
      } else if (minTemp >= 25 && maxTemp <= 30) {
        forecastCondition = "Mendung";
        dailyElements[i].style.backgroundImage =
          "url(./assets/storm-2-trans.gif)";
      } else if (maxTemp > 35) {
        forecastCondition = "Panas Terik";
        dailyElements[i].style.backgroundImage =
          "url(./assets/sun-2-trans.gif)";
      } else if (minTemp >= 25 && maxTemp > 30 && maxTemp <= 33) {
        forecastCondition = "Cerah";
        dailyElements[i].style.backgroundImage =
          "url(./assets/sun-1-trans.gif)";
      } else if (minTemp >= 25 && maxTemp <= 30) {
        forecastCondition = "Berawan";
        dailyElements[i].style.backgroundImage =
          "url(./assets/clouds-1-trans.gif)";
      } else if (minTemp >= 20 && maxTemp <= 30) {
        forecastCondition = "Mendung Berangin";
        dailyElements[i].style.backgroundImage =
          "url(./assets/foggy-1-trans.gif)";
      } else if (minTemp >= 25 && maxTemp <= 33) {
        forecastCondition = "Cerah Berawan";
        dailyElements[i].style.backgroundImage =
          "url(./assets/cloudy-trans.gif)";
      } else {
        forecastCondition = "Cerah";
        dailyElements[i].style.backgroundImage =
          "url(./assets/sun-1-trans.gif)";
      }
      console.log(forecastCondition);

      const date = new Date(hari);
      const dayName = days[date.getDay()];
      dailyElements[i].innerHTML = `
        <div>Hari: ${dayName}</div>
        <div>Tanggal: ${hari}</div>
        <div>Cuaca: ${forecastCondition}</div>
        <div>Max Temp: ${maxTemp} °C</div>
        <div>Min Temp: ${minTemp} °C</div>
      `;
      dailyElements[i].classList.remove("animated");
      void dailyElements[i].offsetWidth;
      dailyElements[i].classList.add("animated");
    }
  });
}

//~ Bagian 9: Mengelola Penggantian Tema (Light/Dark Mode)
function toggleTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const video = document.getElementById("background-video");
  const videoSource = document.getElementById("video-source");
  const loader = document.getElementById("loader");

  themeToggle.addEventListener("change", function () {
    loader.style.display = "block"; // Tampilkan loader saat ganti tema

    setTimeout(() => {
      if (this.checked) {
        body.classList.add("dark-mode");
        videoSource.src = "./assets/dark-mode-vid.mp4";
      } else {
        body.classList.remove("dark-mode");
        videoSource.src = "./assets/air-terjun_2.mp4";
      }
      video.load(); // memuat ulang video agar perubahan terlihat
      loader.style.display = "none"; // menyembunyikan loader setelah tema berhasil diganti
    }, 1000); // mensimulasi waktu loading untuk perubahan tema
  });
}

document.addEventListener("DOMContentLoaded", toggleTheme);
document.addEventListener("DOMContentLoaded", applyInputAnimation);

//~ Bagian 10: Menampilkan Waktu Real-Time
function updateTime() {
  const waktusekarang = new Date();
  document.getElementById(
    "current-time"
  ).textContent = `Waktu: ${waktusekarang.toLocaleTimeString("id-ID")} WIB`;
  // console.log(waktusekarang)
}

setInterval(updateTime, 1000);
