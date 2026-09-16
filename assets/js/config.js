/**
 * Wedding Configuration Data
 * Centralized data source for easy customization
 */
const weddingData = {
    // Couple Information
    groom: {
        fullName: "WIRA BAGUS SETIAWAN PUTRA",
        shortName: "Wira",
        description: "Putra tercinta dari keluarga yang penuh berkah. Pribadi yang berdedikasi, penuh kasih, dan siap membina bahtera rumah tangga yang sakinah, mawaddah, warahmah.",
        photo: "",
        instagram: "https://instagram.com"
    },
    bride: {
        fullName: "NEERAFADIYA AYUNDA SYAKIRA",
        shortName: "Neera",
        description: "Putri tercinta yang anggun dan santun. Pribadi yang hangat, penuh kelembutan, dan siap melangkah bersama membangun masa depan penuh cinta dan kebahagiaan.",
        photo: "",
        instagram: "https://instagram.com"
    },
    displayName: "WIRA & NEERA",
    title: "The Wedding of Wira & Neera",
    tagline: "Menuju Babak Baru Penuh Cinta & Berkah",

    // Event Date & Time (ISO format for countdown accuracy)
    eventDate: "2026-09-10",
    eventTime: "08:00 WIB",
    eventTargetIso: "2026-09-10T08:00:00+07:00",
    timezone: "Asia/Jakarta",

    // Main Couple Photo
    couplePhoto: "",

    // Events Breakdown
    events: [
        {
            title: "Akad Nikah",
            date: "Kamis, 10 September 2026",
            time: "08:00 - 10:00 WIB",
            venue: "Gedung Graha — SMK Bhakti Wiyata",
            address: "Jl. KH. Wachid Hasyim No.65, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur",
            icon: "ring"
        },
        {
            title: "Resepsi Pernikahan",
            date: "Kamis, 10 September 2026",
            time: "11:00 - 14:00 WIB",
            venue: "Gedung Graha — SMK Bhakti Wiyata",
            address: "Jl. KH. Wachid Hasyim No.65, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur",
            icon: "celebration"
        }
    ],

    // Location & Maps
    venue: "Gedung Graha",
    location: "SMK Bhakti Wiyata Kota Kediri, Jawa Timur",
    addressDetail: "Jl. KH. Wachid Hasyim No.65, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur 64114",
    mapsUrl: "https://maps.google.com/?q=SMK+Bhakti+Wiyata+Kediri",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.883733076166!2d112.0001!3d-7.818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7857147b0a3977%3A0x6b8bc27cbbad9d2f!2sSMK%20Bhakti%20Wiyata%20Kediri!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",

    // Music Configuration
    musicUrl: "assets/music/wedding-song.mp3",

    // Digital Gift / Angpao Digital
    gift: {
        bank: {
            bankName: "Bank Central Asia (BCA)",
            accountNumber: "8120938472",
            accountHolder: "Wira Bagus Setiawan Putra"
        },
        ewallet: {
            provider: "GoPay / OVO",
            number: "081234567890",
            holder: "Neerafadiya Ayunda Syakira"
        },
        delivery: {
            recipient: "Wira & Neera",
            phone: "+62 812-3456-7890",
            address: "Kompleks Graha Kediri Asri No. 12, Mojoroto, Kota Kediri, Jawa Timur 64114"
        }
    }
};

// Export to window
window.weddingData = weddingData;
