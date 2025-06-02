# Bookmeza Data Grid & Export System

## Table of Contents

- [English](#english)
  - [Description](#description-en)
  - [Key Features](#key-features-en)
  - [Technologies Used](#technologies-used-en)
  - [Project Structure](#project-structure-en)
  - [Getting Started / Setup](#getting-started--setup-en)
  - [Usage](#usage-en)
  - [Main Components & Props](#main-components--props-en)
  - [Contributing](#contributing-en)
  - [License](#license-en)
- [Türkçe](#türkçe)
  - [Açıklama](#açıklama-tr)
  - [Temel Özellikler](#temel-özellikler-tr)
  - [Kullanılan Teknolojiler](#kullanılan-teknolojiler-tr)
  - [Proje Yapısı](#proje-yapısı-tr)
  - [Başlarken / Kurulum](#başlarken--kurulum-tr)
  - [Kullanım](#kullanım-tr)
  - [Ana Bileşenler & Props](#ana-bileşenler--props-tr)
  - [Katkıda Bulunma](#katkıda-bulunma-tr)
  - [Lisans](#lisans-tr)

---

## <a name="english"></a>English

### <a name="description-en"></a>Description

The Bookmeza Data Grid & Export System is a powerful and feature-rich React component suite designed for dynamic data management and versatile data exporting.

- **`BookmezaDataGrid`**: A modern, responsive data table with comprehensive functionalities including CRUD operations (Add, Edit, Delete), advanced sorting, filtering, search, pagination, row selection, and CSV export. It's highly customizable, allowing for custom column rendering and behavior.
- **`BookmezaExportSystem`**: A demonstration application showcasing advanced data export capabilities to various formats such as CSV, Excel (XLS), PDF, and Word (DOC). It features column selection for exports, configuration options (like headers and delimiters), and a progress indicator for a smooth user experience.

This system is built with React, TypeScript, and Tailwind CSS, prioritizing clean code, performance, and excellent UI/UX.

### <a name="key-features-en"></a>Key Features

**BookmezaDataGrid:**

- **Responsive Design:** Adapts seamlessly to desktop and mobile views.
- **CRUD Operations:** Integrated modal forms (`AutoForm`) for adding, editing, and deleting data entries.
- **Advanced Sorting:** Sort data by multiple columns in ascending or descending order.
- **Filtering:** Filter data based on specific column values using dropdown selectors.
- **Global Search:** Quickly search across designated searchable fields.
- **Pagination:** Efficiently handles large datasets with customizable page sizes.
- **Row Selection:** Allows users to select single or multiple rows for batch operations.
- **CSV Export:** Built-in functionality to export grid data to CSV format.
- **Customizable Columns:** Define custom rendering, width, and behavior for each column.
- **Automatic Forms (`AutoForm`):** Simplifies the creation of forms for adding and editing data.
- **Reusable Modals (`BookmezaModal`, `ConfirmDialog`):** For consistent user interactions and confirmations.

**BookmezaExportSystem (Demo Features):**

- **Multiple Export Formats:** Supports CSV, Excel (XLS), PDF, and Word (DOC) exports.
- **Selective Column Export:** Users can choose which columns to include in the exported file.
- **Export Configuration:** Options to include/exclude headers and set CSV delimiters.
- **Progress Indicator:** Visual feedback during the data export process.
- **Direct Download/Print:** Files are downloaded directly to the user's device, or a print dialog is initiated for PDF.

### <a name="technologies-used-en"></a>Technologies Used

- **React 19:** For building the user interface.
- **TypeScript:** For static typing and improved code quality.
- **Tailwind CSS:** For utility-first CSS styling.
- **Lucide React:** For beautiful and consistent icons.
- **Babel Standalone:** For in-browser JSX and TypeScript transpilation (in the current demo setup).

### <a name="project-structure-en"></a>Project Structure

```
/
├── index.html                # Main HTML file, loads Tailwind CSS & Babel Standalone
├── metadata.json             # Application metadata
├── README.md                 # This file
├── App.tsx                   # Main application component (renders Export System or DataGrid Demo)
├── index.tsx                 # Entry point for the React application
├── constants.tsx             # Global constants, text translations, default column/page configurations
├── types.ts                  # TypeScript type definitions and interfaces
├── utils/
│   └── generateSampleData.ts # Utility function to generate sample data
└── components/
    ├── AutoForm.tsx          # Component for automatic form generation
    ├── BookmezaButton.tsx    # Reusable button component
    ├── BookmezaDataGrid.tsx  # The core data grid component
    ├── BookmezaDataGridDemo.tsx # Demo page for BookmezaDataGrid
    ├── BookmezaExportSystem.tsx # Demo page for advanced export functionalities
    ├── BookmezaInput.tsx     # Reusable input field component
    ├── BookmezaModal.tsx     # Reusable modal component
    └── ConfirmDialog.tsx     # Reusable confirmation dialog component
```

### <a name="getting-started--setup-en"></a>Getting Started / Setup

**Prerequisites:**

- A modern web browser (Chrome, Firefox, Safari, Edge).

**Running the Demo:**

1.  Ensure all the files listed in the "Project Structure" are present in their respective directories.
2.  Open the `index.html` file directly in your web browser.
3.  The application will load, and Babel Standalone will transpile the TypeScript/JSX code in real-time.

**Note:** For production environments or more complex applications, setting up a build process with a bundler like Webpack or Vite is highly recommended over in-browser transpilation.

### <a name="usage-en"></a>Usage

**Using `BookmezaDataGrid`:**

To use the `BookmezaDataGrid` component in your application:

```jsx
import React, { useState } from 'react';
import BookmezaDataGrid from './components/BookmezaDataGrid';
import { generateSampleData } from './utils/generateSampleData'; // Or your own data source
import { SampleDataRow } from './types';
import { TEXTS } from './constants'; // For localized texts

const MyDataApplication = () => {
  const [data, setData] = useState<SampleDataRow[]>(() => generateSampleData(50));

  const handleAdd = (newItem: SampleDataRow) => {
    setData(prevData => [...prevData, { ...newItem, id: Date.now() }]);
    console.log("Added:", newItem);
  };

  const handleEdit = (updatedItem: SampleDataRow) => {
    setData(prevData => prevData.map(item => item.id === updatedItem.id ? updatedItem : item));
    console.log("Edited:", updatedItem);
  };

  const handleDelete = (itemToDelete: SampleDataRow) => {
    setData(prevData => prevData.filter(item => item.id !== itemToDelete.id));
    console.log("Deleted:", itemToDelete);
  };

  return (
    <div className="p-4">
      <BookmezaDataGrid
        data={data}
        title={TEXTS.userManagementSystem}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={(row) => console.log("Row Clicked:", row)}
        // To use custom columns:
        // columnsConfig={myCustomColumnsArray}
      />
    </div>
  );
};

export default MyDataApplication;
```

**`BookmezaExportSystem` Demo:**
The `App.tsx` is currently configured to display the `BookmezaExportSystem` demo. This component showcases how to implement advanced export features using the helper components and export logic provided.

### <a name="main-components--props-en"></a>Main Components & Props

#### `BookmezaDataGrid`

The core data table component.

**Props:**

- `data: SampleDataRow[]` (required): An array of data objects to display.
- `columnsConfig?: BookmezaColumn[]`: Optional. An array to define custom columns. If not provided, `DEFAULT_COLUMNS` from `constants.tsx` will be used.
- `title?: string`: Optional. The title displayed above the data grid.
- `onAdd?: (newData: SampleDataRow) => void`: Optional. Callback function triggered when adding a new item. Enables the "Add New" button.
- `onEdit?: (row: SampleDataRow) => void`: Optional. Callback function triggered when editing an item. Enables edit actions.
- `onDelete?: (row: SampleDataRow) => void`: Optional. Callback function triggered when deleting an item. Enables delete actions.
- `onRowClick?: (row: SampleDataRow) => void`: Optional. Callback function triggered when a row is clicked.

#### Other Key Components

- **`BookmezaInput`**: A styled input component with optional icon support.
- **`BookmezaButton`**: A versatile button component with different variants, sizes, and icon support.
- **`BookmezaModal`**: A reusable modal dialog for displaying content like forms or details.
- **`ConfirmDialog`**: A specialized modal for user confirmations (e.g., before deleting an item).
- **`AutoForm`**: A component that automatically generates a form based on provided data structure, used for add/edit operations within the DataGrid.
- **`BookmezaExportSystem`**: The demo component that orchestrates the advanced export functionality. It contains local versions of `BookmezaButton`, `BookmezaModal`, and `ExportProgress` for its specific needs.

### <a name="contributing-en"></a>Contributing

Contributions, issues, and feature requests are welcome!

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

### <a name="license-en"></a>License

This project is licensed under the MIT License. See the `LICENSE` file for details (if one exists, typically you'd add one). For now, consider it MIT licensed.

---

## <a name="türkçe"></a>Türkçe

### <a name="açıklama-tr"></a>Açıklama

Bookmeza Veri Tablosu & Dışa Aktarma Sistemi, dinamik veri yönetimi ve çok yönlü veri dışa aktarımı için tasarlanmış güçlü ve zengin özelliklere sahip bir React bileşen paketidir.

- **`BookmezaDataGrid`**: CRUD işlemleri (Ekle, Düzenle, Sil), gelişmiş sıralama, filtreleme, arama, sayfalama, satır seçimi ve CSV dışa aktarma gibi kapsamlı işlevlere sahip modern, duyarlı bir veri tablosudur. Özel sütun oluşturma ve davranış tanımlama gibi yüksek düzeyde özelleştirilebilirlik sunar.
- **`BookmezaExportSystem`**: CSV, Excel (XLS), PDF ve Word (DOC) gibi çeşitli formatlara gelişmiş veri dışa aktarma yeteneklerini gösteren bir demo uygulamasıdır. Dışa aktarmalar için sütun seçimi, yapılandırma seçenekleri (başlıklar ve sınırlayıcılar gibi) ve akıcı bir kullanıcı deneyimi için bir ilerleme göstergesi içerir.

Bu sistem, temiz kod, performans ve mükemmel UI/UX önceliklendirilerek React, TypeScript ve Tailwind CSS ile geliştirilmiştir.

### <a name="temel-özellikler-tr"></a>Temel Özellikler

**BookmezaDataGrid:**

- **Duyarlı Tasarım:** Masaüstü ve mobil görünümlere sorunsuz bir şekilde uyum sağlar.
- **CRUD İşlemleri:** Veri girişlerini eklemek, düzenlemek ve silmek için entegre modal formlar (`AutoForm`).
- **Gelişmiş Sıralama:** Verileri artan veya azalan düzende birden fazla sütuna göre sıralama.
- **Filtreleme:** Açılır seçiciler kullanarak verileri belirli sütun değerlerine göre filtreleme.
- **Genel Arama:** Belirlenmiş aranabilir alanlarda hızlı arama.
- **Sayfalama:** Özelleştirilebilir sayfa boyutlarıyla büyük veri kümelerini verimli bir şekilde yönetme.
- **Satır Seçimi:** Kullanıcıların toplu işlemler için tek veya çoklu satır seçmesine olanak tanır.
- **CSV Dışa Aktarma:** Tablo verilerini CSV formatında dışa aktarmak için yerleşik işlevsellik.
- **Özelleştirilebilir Sütunlar:** Her sütun için özel oluşturma, genişlik ve davranış tanımlama.
- **Otomatik Formlar (`AutoForm`):** Veri ekleme ve düzenleme formlarının oluşturulmasını basitleştirir.
- **Yeniden Kullanılabilir Modallar (`BookmezaModal`, `ConfirmDialog`):** Tutarlı kullanıcı etkileşimleri ve onaylamalar için.

**BookmezaExportSystem (Demo Özellikleri):**

- **Çoklu Dışa Aktarma Formatları:** CSV, Excel (XLS), PDF ve Word (DOC) dışa aktarımlarını destekler.
- **Seçici Sütun Dışa Aktarma:** Kullanıcılar dışa aktarılan dosyaya hangi sütunların dahil edileceğini seçebilir.
- **Dışa Aktarma Yapılandırması:** Başlıkları dahil etme/hariç tutma ve CSV sınırlayıcılarını ayarlama seçenekleri.
- **İlerleme Göstergesi:** Veri dışa aktarma işlemi sırasında görsel geri bildirim.
- **Doğrudan İndirme/Yazdırma:** Dosyalar doğrudan kullanıcının cihazına indirilir veya PDF için bir yazdırma iletişim kutusu başlatılır.

### <a name="kullanılan-teknolojiler-tr"></a>Kullanılan Teknolojiler

- **React 19:** Kullanıcı arayüzünü oluşturmak için.
- **TypeScript:** Statik tipleme ve geliştirilmiş kod kalitesi için.
- **Tailwind CSS:** Yardımcı program öncelikli CSS stillendirmesi için.
- **Lucide React:** Güzel ve tutarlı ikonlar için.
- **Babel Standalone:** Tarayıcı içinde JSX ve TypeScript transpiling için (mevcut demo kurulumunda).

### <a name="proje-yapısı-tr"></a>Proje Yapısı

```
/
├── index.html                # Ana HTML dosyası, Tailwind CSS & Babel Standalone yükler
├── metadata.json             # Uygulama meta verileri
├── README.md                 # Bu dosya
├── App.tsx                   # Ana uygulama bileşeni (Dışa Aktarma Sistemi veya DataGrid Demosunu render eder)
├── index.tsx                 # React uygulaması için giriş noktası
├── constants.tsx             # Genel sabitler, metin çevirileri, varsayılan sütun/sayfa yapılandırmaları
├── types.ts                  # TypeScript tip tanımları ve arayüzleri
├── utils/
│   └── generateSampleData.ts # Örnek veri oluşturmak için yardımcı fonksiyon
└── components/
    ├── AutoForm.tsx          # Otomatik form oluşturma bileşeni
    ├── BookmezaButton.tsx    # Yeniden kullanılabilir düğme bileşeni
    ├── BookmezaDataGrid.tsx  # Temel veri tablosu bileşeni
    ├── BookmezaDataGridDemo.tsx # BookmezaDataGrid için demo sayfası
    ├── BookmezaExportSystem.tsx # Gelişmiş dışa aktarma işlevleri için demo sayfası
    ├── BookmezaInput.tsx     # Yeniden kullanılabilir giriş alanı bileşeni
    ├── BookmezaModal.tsx     # Yeniden kullanılabilir modal bileşeni
    └── ConfirmDialog.tsx     # Yeniden kullanılabilir onay iletişim kutusu bileşeni
```

### <a name="başlarken--kurulum-tr"></a>Başlarken / Kurulum

**Önkoşullar:**

- Modern bir web tarayıcısı (Chrome, Firefox, Safari, Edge).

**Demoyu Çalıştırma:**

1.  "Proje Yapısı" bölümünde listelenen tüm dosyaların ilgili dizinlerinde bulunduğundan emin olun.
2.  `index.html` dosyasını doğrudan web tarayıcınızda açın.
3.  Uygulama yüklenecek ve Babel Standalone, TypeScript/JSX kodunu gerçek zamanlı olarak derleyecektir.

**Not:** Üretim ortamları veya daha karmaşık uygulamalar için, tarayıcı içi transpiling yerine Webpack veya Vite gibi bir paketleyici ile bir derleme süreci kurmanız şiddetle tavsiye edilir.

### <a name="kullanım-tr"></a>Kullanım

**`BookmezaDataGrid` Kullanımı:**

`BookmezaDataGrid` bileşenini uygulamanızda kullanmak için:

```jsx
import React, { useState } from 'react';
import BookmezaDataGrid from './components/BookmezaDataGrid';
import { generateSampleData } from './utils/generateSampleData'; // Veya kendi veri kaynağınız
import { SampleDataRow } from './types';
import { TEXTS } from './constants'; // Yerelleştirilmiş metinler için

const VeriUygulamam = () => {
  const [data, setData] = useState<SampleDataRow[]>(() => generateSampleData(50));

  const handleAdd = (yeniOge: SampleDataRow) => {
    setData(oncekiVeri => [...oncekiVeri, { ...yeniOge, id: Date.now() }]);
    console.log("Eklendi:", yeniOge);
  };

  const handleEdit = (guncellenenOge: SampleDataRow) => {
    setData(oncekiVeri => oncekiVeri.map(oge => oge.id === guncellenenOge.id ? guncellenenOge : oge));
    console.log("Düzenlendi:", guncellenenOge);
  };

  const handleDelete = (silinecekOge: SampleDataRow) => {
    setData(oncekiVeri => oncekiVeri.filter(oge => oge.id !== silinecekOge.id));
    console.log("Silindi:", silinecekOge);
  };

  return (
    <div className="p-4">
      <BookmezaDataGrid
        data={data}
        title={TEXTS.userManagementSystem}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={(satir) => console.log("Satır Tıklandı:", satir)}
        // Özel sütunlar kullanmak için:
        // columnsConfig={ozelSutunDizim}
      />
    </div>
  );
};

export default VeriUygulamam;
```

**`BookmezaExportSystem` Demosu:**
`App.tsx` şu anda `BookmezaExportSystem` demosunu gösterecek şekilde yapılandırılmıştır. Bu bileşen, sağlanan yardımcı bileşenleri ve dışa aktarma mantığını kullanarak gelişmiş dışa aktarma özelliklerinin nasıl uygulanacağını gösterir.

### <a name="ana-bileşenler--props-tr"></a>Ana Bileşenler & Props

#### `BookmezaDataGrid`

Temel veri tablosu bileşeni.

**Props:**

- `data: SampleDataRow[]` (gerekli): Görüntülenecek veri nesneleri dizisi.
- `columnsConfig?: BookmezaColumn[]`: İsteğe bağlı. Özel sütunları tanımlamak için bir dizi. Sağlanmazsa, `constants.tsx` dosyasındaki `DEFAULT_COLUMNS` kullanılır.
- `title?: string`: İsteğe bağlı. Veri tablosunun üzerinde görüntülenen başlık.
- `onAdd?: (newData: SampleDataRow) => void`: İsteğe bağlı. Yeni bir öğe eklenirken tetiklenen geri arama fonksiyonu. "Yeni Ekle" düğmesini etkinleştirir.
- `onEdit?: (row: SampleDataRow) => void`: İsteğe bağlı. Bir öğe düzenlenirken tetiklenen geri arama fonksiyonu. Düzenleme eylemlerini etkinleştirir.
- `onDelete?: (row: SampleDataRow) => void`: İsteğe bağlı. Bir öğe silinirken tetiklenen geri arama fonksiyonu. Silme eylemlerini etkinleştirir.
- `onRowClick?: (row: SampleDataRow) => void`: İsteğe bağlı. Bir satıra tıklandığında tetiklenen geri arama fonksiyonu.

#### Diğer Anahtar Bileşenler

- **`BookmezaInput`**: İsteğe bağlı ikon desteğiyle stilize edilmiş bir giriş bileşeni.
- **`BookmezaButton`**: Farklı varyantlara, boyutlara ve ikon desteğine sahip çok yönlü bir düğme bileşeni.
- **`BookmezaModal`**: Formlar veya ayrıntılar gibi içeriği görüntülemek için yeniden kullanılabilir bir modal iletişim kutusu.
- **`ConfirmDialog`**: Kullanıcı onayları için özel bir modal (örneğin, bir öğeyi silmeden önce).
- **`AutoForm`**: Sağlanan veri yapısına göre otomatik olarak bir form oluşturan, DataGrid içinde ekleme/düzenleme işlemleri için kullanılan bir bileşen.
- **`BookmezaExportSystem`**: Gelişmiş dışa aktarma işlevselliğini düzenleyen demo bileşeni. Kendi özel ihtiyaçları için `BookmezaButton`, `BookmezaModal` ve `ExportProgress`'in yerel sürümlerini içerir.

### <a name="katkıda-bulunma-tr"></a>Katkıda Bulunma

Katkılar, sorunlar ve özellik istekleri kabul edilir!

1.  Depoyu forklayın.
2.  Özellik dalınızı oluşturun (`git checkout -b feature/HarikaOzellik`).
3.  Değişikliklerinizi commit edin (`git commit -m 'HarikaOzellik eklendi'`).
4.  Dala push edin (`git push origin feature/HarikaOzellik`).
5.  Bir Pull Request açın.

### <a name="lisans-tr"></a>Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Ayrıntılar için `LICENSE` dosyasına bakın (eğer varsa, genellikle bir tane eklenir). Şimdilik MIT lisanslı olduğunu düşünebilirsiniz.
