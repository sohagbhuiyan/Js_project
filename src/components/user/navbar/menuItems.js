// menuItems.js
export const menuItems = [

     { name: "Home", path: "/" },
     {
     name: "Notebook",
     subMenu: [
   
           { name: "HP", path: "/all-notebook/hp" },
           { name: "Dell", path: "/all-notebook/dell" },
           { name: "Acer", path: "/all-notebook/acer" },
           { name: "Asus", path: "/all-notebook/asus" },
           { name: "Lenovo", path: "/all-notebook/lenovo" },
           { name: "Apple", path: "/all-notebook/apple" },
           { name: "i-Life", path: "/all-notebook/i-life" },
           { name: "Huawei", path: "/all-notebook/huawei" },
           { name: "Surface", path: "/all-notebook/surface" },
         ],
       },
       {
         name: "Notebook Accessories",
         subMenu: [
           { name: "Notebook Adapter", path: "/notebook-accessories/adapter" },
           { name: "Notebook Charger", path: "/notebook-accessories/charger" },
           { name: "Notebook Bag", path: "/notebook-accessories/bag" },
           { name: "Notebook Stand", path: "/notebook-accessories/stand" },
        
     ],
   },
   {
     name: "Desktop",
     subMenu: [
       { name: "HP", path: "/desktop/hp" },
       { name: "Asus", path: "/desktop/Asus" },
       { name: "Acer", path: "/desktop/Acer" },
       { name: "Dell", path: "/desktop/dell" },
       { name: "Apple", path: "/desktop/apple" },
       { name: "Lenovo", path: "/desktop/lenovo" },
     ],
   },
   {
     name: "Accessories & Gaming",
    
     subMenu: [
       { name: "Ram", path: "/accessories&gaming/ram" },
       { name: "Casing", path: "accessories&gaming/casing" },
       { name: "DVD-RW", path: "/accessories&gaming/dvd-rw" },
       { name: "Processor", path: "accessories&gaming/processor" },
       { name: "Mainboard", path: "/accessories&gaming/mainboard" },
       { name: "Graphics Card", path: "accessories&gaming/graphics-card" },
       { name: "Power Supply", path: "/accessories&gaming/power-supply" },
       { name: "Keyboard", path: "accessories&gaming/keyboard" },
       { name: "Mouse", path: "/accessories&gaming/mouse" },
       { name: "Mouse Pad", path: "accessories&gaming/mouse-pad" },
       { name: "Gaming Controller", path: "/accessories&gaming/gaming-controller" },
       { name: "CPU Cooler", path: "accessories&gaming/cpu-cooler" },
       { name: "Casing Fan", path: "/accessories&gaming/casing-fan" },
       { name: "Ram Cooler", path: "accessories&gaming/ram-cooler" },
   
     ],
   },
   {
     name: "Monitor",
   
     subMenu: [
       { name: "Dahua", path: "/monitor/dahua" },
       { name: "HKC", path: "/monitor/hkc" },
       { name: "Hikvision", path: "/monitor/hikvision" },
       { name: "Realview", path: "/monitor/realview" },
       { name: "Redmi", path: "/monitor/redmi" },
       { name: "BenQ", path: "/monitor/benq" },
       { name: "Asus", path: "/monitor/asus" },
       { name: "LG", path: "/monitor/lg" },
       { name: "DELL", path: "/monitor/dell" },
       { name: "Samsung", path: "/monitor/samsung" },
       { name: "HP", path: "/monitor/hp" },
       { name: "AOC", path: "/monitor/aoc" },
       { name: "Lenovo", path: "/monitor/lenovo" },
       { name: "Acer", path: "/monitor/acer" },
       { name: "Viewsonic", path: "/monitor/viewsonic" },
     ],
     },
     {
       name: "Storage",
      
       subMenu: [
         { name: "Pen Drive", path: "/storage/pendrive" },
         { name: "HDD Internal", path: "/storage/hdd-internal" },
         { name: "HDD External (USB)", path: "/storage/HDD External (USB)" },
         { name: "Memory Card", path: "/storage/Memory Card" },
         { name: "SSD External", path: "/storage/SSD External" },
         { name: "SSD Internal", path: "/storage/SSD Internal" },
       ],
     },
     {
      name: "Printer & Scanner",
      subMenu: [
        {
              name: "All Printers",
              subMenu: [
                { name: "Ink Printer", path: "/all-Printer/ink-printer" },
                { name: "Laser Printer", path: "/all-Printer/laser-printer" },
                { name: "Dot Matrix Printer", path: "/all-Printer/dot-matrix" },
                { name: "Large Format Printer", path: "/all-Printer/large-format" },
                { name: "POS Printer", path: "/all-Printer/pos-printer" },
                { name: "Label Printer", path: "/all-Printer/label-printer" },
                { name: "Card Printer", path: "/all-Printer/card-printer" },
                { name: "Flatbed Scanner", path: "/all-Printer/flatbed" },
                { name: "Sheetfed Scanner", path: "/all-Printer/sheetfed" },
                { name: "Barcode Scanner", path: "/all-Printer/barcode" },
              ]
            },
     {
          name: "Printer Accessories",
          subMenu: [
                { name: "Toner", path: "/accessories/toner" },
                { name: "Ink Bottle", path: "/accessories/ink-bottle" },
                { name: "Cartridge", path: "/accessories/cartridge" },
                { name: "Ribbon", path: "/accessories/ribbon" },
                { name: "Photo Paper", path: "/accessories/photo-paper" },
                { name: "Fuser Film", path: "/components/fuser-film" },
                { name: "Pickup Roller", path: "/components/pickup-roller" },
                { name: "Pressure Ruler", path: "/components/pressure-ruler" },
                { name: "Printer Drum", path: "/components/drum" },
                { name: "Printer Head", path: "/components/head" },
                { name: "Printer Switch", path: "/components/switch" },
                { name: "Printer Cable", path: "/components/cable" },
                { name: "Refill Service", path: "/services/refill" },
                { name: "Maintenance", path: "/services/maintenance" },
              ]
            }
          ]
        },
     {
       name: "Camera",
   
       subMenu: [
         { name: "Canon", path: "/camera/canon" },
         { name: "Sony", path: "/camera/sony" },
         { name: "MSI", path: "/camera/msi" },
       ],
     },
     {
       name: "Security System",
   
       subMenu: [
         { name: "XYZ", path: "/security-system/xyz" },
         { name: "ABC", path: "/security-system/abc" },
         { name: "WFDSD", path: "/security-system/wfdsd" },
       ],
     },
     {
       name: "Network Items",
   
       subMenu: [
         { name: "SDVX", path: "/network/sdvx" },
         { name: "DFDF", path: "/network/dfdf" },
         { name: "Ddfell", path: "/network/ddfell" },
         { name: "ABC", path: "/network/abc" },
         { name: "SFDSD", path: "/network/sfdsd" },
       ],
     },
     {
       name: "Sound System",
     
       subMenu: [
         { name: "WCSAC", path: "/sound-system/wcsac" },
         { name: "Tep", path: "/sound-system/tep" },
         { name: "QWD", path: "/sound-system/qwd" },
       ],
     },
     {
       name: "Office Items",
     
       subMenu: [
         { name: "CSDD", path: "/office-items/csdd" },
         { name: "TGVE", path: "/office-items/tgve" },
         { name: "BEFxs", path: "/office-items/befxs" },
       ],
     },
     {
       name: "Photocopier",
   
       subMenu: [
         { name: "CEW", path: "/accessories/cew" },
         { name: "BGD", path: "/accessories/bgd" },
         { name: "NTgf", path: "/accessories/ntgf" },
         { name: "ABC", path: "/accessories/abc" },
         { name: "AFDSD", path: "/accessories/afdsd" },
       ],
     },
     {
       name: "Projector",
   
       subMenu: [
         { name: "ZEDSA", path: "/software/zedsa" },
         { name: "MJHg", path: "/software/mjhg" },
         { name: "HFASD", path: "/software/hfasd" },
       ],
     },
     {
       name: "Cable & Converter",
    
       subMenu: [
         { name: "WDWD", path: "/daily-life/wdwd" },
         { name: "TWWW", path: "/daily-life/twww" },
         { name: "VDSE", path: "/daily-life/vdse" },
       ],
     },
     {
       name: "Electronic Gadgets",
    
       subMenu: [
         { name: "OPhg", path: "/store/ophg" },
         { name: "Crsd", path: "/store/crsd" },
         { name: "Dell", path: "/store/dell" },
       ],
     },
     {
       name: "Educational Items",
   
       subMenu: [
         { name: "OPhg", path: "/store/ophg" },
         { name: "Crsd", path: "/store/crsd" },
         { name: "Dell", path: "/store/dell" },
       ],
     },
   ];
   