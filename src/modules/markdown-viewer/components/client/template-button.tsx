
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TemplateButtonProps {
  onInsert: (template: string) => void;
}

const MDX_TEMPLATES = [
  {
    name: "Basic Structure",
    description: "Simple markdown with headings, lists, and code",
    content: 
`# Main Heading

## Subheading

This is a paragraph with **bold text** and *italic text*.

### Lists

- Item 1
- Item 2
- Item 3

1. First item
2. Second item
3. Third item

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

> This is a blockquote that spans
> multiple lines in the content.

[Link to Google](https://www.google.com)
`
  },
  {
    name: "Documentation Template",
    description: "Template for API documentation",
    content: 
`# API Documentation

## Introduction

This API allows you to access and manipulate data from our service.

## Authentication

All API requests require an API key that should be included in the header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### GET /api/items

Returns a list of all items.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| limit | integer | Maximum number of items to return |
| offset | integer | Number of items to skip |

#### Response

\`\`\`json
{
  "items": [
    {
      "id": 1,
      "name": "Item 1"
    },
    {
      "id": 2,
      "name": "Item 2"
    }
  ],
  "total": 100
}
\`\`\`

## Error Codes

| Code | Description |
| ---- | ----------- |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
`
  },
  {
    name: "Blog Post",
    description: "Template for a blog post",
    content: 
`---
title: My Awesome Blog Post
author: John Doe
date: 2023-07-10
---

# My Awesome Blog Post

![Header Image](https://example.com/image.jpg)

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.

## Main Content

### First Point

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.

### Second Point

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.

## Code Example

\`\`\`python
def hello_world():
    print("Hello, World!")

hello_world()
\`\`\`

## Conclusion

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacinia, nunc nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.

---

*Thanks for reading!*
`
  },
  {
    name: "GitHub README",
    description: "Template for a GitHub README file",
    content: 
`# Project Name

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

A brief description of what this project does and who it's for.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project.git

# Go into the repository
cd project

# Install dependencies
npm install

# Run the app
npm start
\`\`\`

## Usage

\`\`\`javascript
import { myFunction } from 'my-project';

// Usage example
myFunction('Hello, world!');
\`\`\`

## API Reference

#### Get all items

\`\`\`http
GET /api/items
\`\`\`

#### Get item

\`\`\`http
GET /api/items/${id}
\`\`\`

## Contributing

Contributions are always welcome!

See \`contributing.md\` for ways to get started.

## License

[MIT](https://choosealicense.com/licenses/mit/)
`
  }
];

const TemplateButton: React.FC<TemplateButtonProps> = ({ onInsert }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <Popover>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Insert template">
                <FileText className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          
          <PopoverContent 
            className="w-80 p-0" 
            align="start"
            sideOffset={5}
          >
            <div className="p-2 border-b">
              <h3 className="font-medium text-sm">MDX Templates</h3>
              <p className="text-xs text-muted-foreground">Choose a template to insert</p>
            </div>
            
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                {MDX_TEMPLATES.map((template, index) => (
                  <div 
                    key={index}
                    className="p-2 hover:bg-accent rounded-md cursor-pointer mb-1"
                    onClick={() => onInsert(template.content)}
                  >
                    <h4 className="text-sm font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
          
          <TooltipContent>
            <p>Insert template</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TooltipProvider>
  );
};

export default TemplateButton;
