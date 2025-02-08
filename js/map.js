 // إنشاء الخريطة وتحديد الموقع الافتراضي (الأردن)
 const map = L.map('map').setView([31.963158, 35.930359], 8);

 // إضافة طبقة الخريطة
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);

 // بيانات محطات الشحن في الأردن
 const stations = [
   {
     id: 1,
     name: "Abdoun Station",
     lat: 31.9496,
     lng: 35.8934,
     available: true,
     sockets: 4,
     workingHours: "24/7",
     level: "Level 3 (Fast Charging)",
     chargers: ["Type 1", "Type 2", "CHAdeMO"]
   },
   {
     id: 2,
     name: "Marj Al-Hamam Station",
     lat: 31.9158,
     lng: 35.8562,
     available: false,
     sockets: 2,
     workingHours: "9 AM - 9 PM",
     level: "Level 2 (Medium Charging)",
     chargers: ["Type 2", "CCS"]
   },
   {
     id: 3,
     name: "Mecca Street Station",
     lat: 31.9784,
     lng: 35.8554,
     available: true,
     sockets: 6,
     workingHours: "24/7",
     level: "Level 3 (Fast Charging)",
     chargers: ["Type 1", "CHAdeMO", "CCS"]
   }
 ];

 // الحصول على موقع المستخدم
 navigator.geolocation.getCurrentPosition(position => {
   const userLat = position.coords.latitude;
   const userLng = position.coords.longitude;

   // حساب المسافة والوقت التقديري لكل محطة
   stations.forEach(station => {
     const distance = calculateDistance(userLat, userLng, station.lat, station.lng);
     station.distance = `${distance.toFixed(2)} km`;
     const averageSpeed = 50; // سرعة متوسطة بالكيلومتر/ساعة
     station.estimatedTime = `${Math.ceil((distance / averageSpeed) * 60)} mins`; // الوقت بالدقائق

     // إضافة العلامة على الخريطة
     const marker = L.marker([station.lat, station.lng]).addTo(map);
     marker.bindPopup(`
       <div class="station-card">
         <h4>${station.name}</h4>
         <p>Sockets: ${station.sockets}</p>
         <p>Available Now: ${station.available ? "Yes" : "No"}</p>
         <p>Working Hours: ${station.workingHours}</p>
         <p>Charging Level: ${station.level}</p>
         <p>Distance: ${station.distance}</p>
         <p>Estimated Time: ${station.estimatedTime}</p>
         <p>Available Chargers:</p>
         <ul>
           ${station.chargers.map(charger => `<li>${charger}</li>`).join("")}
         </ul>
         <button class="info-btn" onclick="window.location.href='./detalsstation.html'">More Info</button>
         <button class="navigate-btn" onclick="navigateToStation(${station.lat}, ${station.lng})">Navigate</button>
       </div>
     `);
   });
 });

 // حساب المسافة بين نقطتين باستخدام صيغة هافرسين
 function calculateDistance(lat1, lng1, lat2, lng2) {
   const R = 6371; // نصف قطر الأرض بالكيلومترات
   const dLat = (lat2 - lat1) * Math.PI / 180;
   const dLng = (lng2 - lng1) * Math.PI / 180;
   const a = 
     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
     Math.sin(dLng / 2) * Math.sin(dLng / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return R * c;
 }

 // وظيفة عرض المزيد من المعلومات
 function showStationInfo(stationId) {
   const station = stations.find(s => s.id === stationId);
   console.log(`
     Station Name: ${station.name}
     Sockets: ${station.sockets}
     Available Now: ${station.available ? "Yes" : "No"}
     Working Hours: ${station.workingHours}
     Charging Level: ${station.level}
     Chargers: ${station.chargers.join(", ")}
     Distance: ${station.distance}
     Estimated Time: ${station.estimatedTime}
   `);
 }

 // وظيفة التوجه إلى المحطة باستخدام Google Maps
 function navigateToStation(lat, lng) {
   const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
   window.open(url, '_blank');
 }