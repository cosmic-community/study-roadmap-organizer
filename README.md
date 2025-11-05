# 📚 Study Roadmap Organizer

![App Preview](https://imgix.cosmicjs.com/6285a9c0-b9ed-11f0-acea-b11c5ee9e1b0-photo-1576091160399-112ba8d25d1d-1762308963973.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A powerful Vue.js study management platform that transforms your documents and notes into an organized, visual roadmap for effective learning. Upload PDFs, research papers, and notes, and get AI-powered summaries with key insights arranged in an easy-to-navigate structure.

## ✨ Features

- 📄 **Document Management**: Upload and organize PDFs, notes, research papers, and reports
- 🤖 **AI Summaries**: Automatic generation of document summaries for quick understanding
- 💡 **Key Insights**: Important points extracted and highlighted in markdown format
- 🏷️ **Smart Categorization**: Organize documents by categories (Research Papers, Meeting Notes)
- 🗺️ **Visual Roadmap**: Interactive timeline view of your study materials
- 🔍 **Advanced Search**: Find documents quickly using tags and filters
- 📊 **Processing Status**: Track document processing stages (Pending, Processing, Completed)
- 🎯 **Document Types**: Support for PDF, Notes, Reports, Articles, and more
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=690ab273fb7423bbdde4a566&clone_repository=690ab531fb7423bbdde4a585)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "It should be able to understand the PDFs files or any written notes. Where it process and arrange them and make it easy to acces it takes files as input and gives the out put as an arranged version of the file with little explanation"

### Code Generation Prompt

> "Develop a Vue.js application that uses my existing object types and objects were we get arranged road map for studying"

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Frontend Framework**: Vue.js 3 with Composition API
- **Styling**: Tailwind CSS
- **CMS**: Cosmic (Headless CMS)
- **API Integration**: Cosmic SDK v1.5.6
- **Routing**: Vue Router 4
- **State Management**: Vue 3 Composition API (Reactive state)
- **Build Tool**: Vite
- **Package Manager**: Bun
- **TypeScript**: For type safety and better developer experience
- **Markdown Parsing**: For rendering key insights
- **HTML Parsing**: For rendering AI summaries

## 🚀 Getting Started

### Prerequisites

- Bun installed on your machine
- A Cosmic account with your bucket set up
- Environment variables configured

### Installation

1. **Clone the repository** (after clicking "Clone this Project" above)

2. **Install dependencies**:
```bash
bun install
```

3. **Set up environment variables**:

Create a `.env` file in the root directory:

```env
VITE_COSMIC_BUCKET_SLUG=your-bucket-slug
VITE_COSMIC_READ_KEY=your-read-key
VITE_COSMIC_WRITE_KEY=your-write-key
```

4. **Run the development server**:
```bash
bun run dev
```

5. **Open your browser** and navigate to `http://localhost:5173`

## 📚 Cosmic SDK Examples

### Fetching All Documents with Categories

```typescript
import { cosmic } from './lib/cosmic'

// Fetch documents with connected category objects
const { objects: documents } = await cosmic.objects
  .find({ type: 'documents' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Access category information
documents.forEach(doc => {
  console.log(doc.metadata.category?.title) // Category name
  console.log(doc.metadata.ai_summary) // AI-generated summary
  console.log(doc.metadata.key_insights) // Extracted insights
})
```

### Fetching Documents by Category

```typescript
// Get all documents in a specific category
const categoryId = 'category-object-id'

const { objects: documents } = await cosmic.objects
  .find({
    type: 'documents',
    'metadata.category': categoryId
  })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Creating a New Document

```typescript
await cosmic.objects.insertOne({
  type: 'documents',
  title: 'My Research Paper',
  metadata: {
    document_title: 'My Research Paper',
    original_file: 'uploaded-file-name.pdf', // Media name from bucket
    ai_summary: '<p>Summary content here...</p>',
    key_insights: '# Key Points\n\n- Point 1\n- Point 2',
    category: 'category-object-id',
    processing_status: 'Completed', // Must match content model values
    upload_date: '2024-01-15',
    document_type: 'PDF Document', // Must match content model values
    tags: 'research, study, important'
  }
})
```

## 🔗 Cosmic CMS Integration

This application uses Cosmic as a headless CMS with the following structure:

### Object Types

1. **Documents** (`documents`)
   - Document Title (text, required)
   - Original File (file, required)
   - AI Summary (html-textarea)
   - Key Insights (markdown)
   - Category (object reference to categories)
   - Processing Status (select-dropdown: Pending, Processing, Completed)
   - Upload Date (date)
   - Document Type (select-dropdown: PDF Document, Written Notes, Report, Article, Other)
   - Tags (text, comma-separated)

2. **Categories** (`categories`)
   - Category Name (text, required)
   - Description (textarea)

### Content Relationships

- Documents are connected to Categories via object metafield
- Categories help organize documents into logical groups
- All relationships are resolved automatically using depth queries

## 🌐 Deployment Options

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_COSMIC_BUCKET_SLUG`
   - `VITE_COSMIC_READ_KEY`
   - `VITE_COSMIC_WRITE_KEY`
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Create new site from Git in Netlify
3. Add environment variables in Netlify dashboard
4. Set build command to `bun run build`
5. Set publish directory to `dist`
6. Deploy!

## 📝 Notes

- The application uses the Cosmic SDK v1.5.6 for all API interactions
- All document files are stored in your Cosmic bucket's media library
- AI summaries and key insights can be generated manually or via AI processing
- Processing status tracks the document lifecycle
- Categories help organize your study materials logically
- Tags enable quick search and filtering of documents

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for your own learning and development.

---

Built with ❤️ using Vue.js and Cosmic

<!-- README_END -->