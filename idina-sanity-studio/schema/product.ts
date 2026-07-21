import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'nameEn', title: 'Product Name (English)', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'nameHa', title: 'Product Name (Hausa)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'nameEn', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({
      name: 'brand', title: 'Brand', type: 'string',
      options: {
        list: [
          { title: 'Apple', value: 'apple' },
          { title: 'Samsung', value: 'samsung' },
          { title: 'Infinix', value: 'infinix' },
          { title: 'Tecno', value: 'tecno' },
          { title: 'Xiaomi', value: 'xiaomi' },
          { title: 'Huawei', value: 'huawei' },
          { title: 'Itel', value: 'itel' },
          { title: 'Nokia', value: 'nokia' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'category', title: 'Category', type: 'string',
      options: {
        list: [
          { title: 'Phone', value: 'phone' },
          { title: 'Charger', value: 'charger' },
          { title: 'Earbuds', value: 'earbuds' },
          { title: 'AirPods', value: 'airpods' },
          { title: 'Smartwatch', value: 'smartwatch' },
          { title: 'Apple Watch', value: 'applewatch' },
          { title: 'Case', value: 'case' },
          { title: 'Screen Protector', value: 'screenprotector' },
          { title: 'Cable', value: 'cable' },
          { title: 'Power Bank', value: 'powerbank' },
          { title: 'Accessory', value: 'accessory' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({ name: 'hasVariants', title: 'Has Variants (Color/Storage)', type: 'boolean', initialValue: false, description: 'Enable if this product has different colors and storage options with different prices' }),
    defineField({ name: 'price', title: 'Price (₦)', type: 'number', validation: (Rule) => Rule.required().positive(), hidden: ({ parent }) => parent?.hasVariants }),
    defineField({ name: 'comparePrice', title: 'Compare at Price (₦)', type: 'number', hidden: ({ parent }) => parent?.hasVariants }),
    defineField({ name: 'stock', title: 'Stock Quantity', type: 'number', validation: (Rule) => Rule.required().min(0), hidden: ({ parent }) => parent?.hasVariants }),
    defineField({ 
      name: 'variants', 
      title: 'Product Variants', 
      type: 'array', 
      of: [{
        type: 'object',
        fields: [
          defineField({ 
            name: 'color', 
            title: 'Color', 
            type: 'string',
            options: {
              list: [
                { title: 'Black', value: 'black' },
                { title: 'White', value: 'white' },
                { title: 'Silver', value: 'silver' },
                { title: 'Gold', value: 'gold' },
                { title: 'Rose Gold', value: 'rose-gold' },
                { title: 'Blue', value: 'blue' },
                { title: 'Red', value: 'red' },
                { title: 'Green', value: 'green' },
                { title: 'Purple', value: 'purple' },
                { title: 'Orange', value: 'orange' },
                { title: 'Yellow', value: 'yellow' },
                { title: 'Pink', value: 'pink' },
                { title: 'Gray', value: 'gray' },
                { title: 'Midnight Green', value: 'midnight-green' },
                { title: 'Space Gray', value: 'space-gray' },
                { title: 'Graphite', value: 'graphite' },
                { title: 'Sierra Blue', value: 'sierra-blue' },
                { title: 'Deep Purple', value: 'deep-purple' },
                { title: 'Starlight', value: 'starlight' },
                { title: 'Other', value: 'other' },
              ],
              layout: 'dropdown',
            },
            validation: (Rule) => Rule.required()
          }),
          defineField({ 
            name: 'storage', 
            title: 'Storage', 
            type: 'string',
            options: {
              list: [
                { title: '64GB', value: '64gb' },
                { title: '128GB', value: '128gb' },
                { title: '256GB', value: '256gb' },
                { title: '512GB', value: '512gb' },
                { title: '1TB', value: '1tb' },
              ],
              layout: 'dropdown',
            },
            validation: (Rule) => Rule.required()
          }),
          defineField({ name: 'price', title: 'Price (₦)', type: 'number', validation: (Rule) => Rule.required().positive() }),
          defineField({ name: 'comparePrice', title: 'Compare at Price (₦)', type: 'number' }),
          defineField({ name: 'stock', title: 'Stock Quantity', type: 'number', validation: (Rule) => Rule.required().min(0) }),
        ],
      }],
      hidden: ({ parent }) => !parent?.hasVariants,
      validation: (Rule) => Rule.custom((variants, context) => {
        if (context.parent?.hasVariants && (!variants || variants.length === 0)) {
          return 'At least one variant is required when hasVariants is enabled'
        }
        return true
      })
    }),
    defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], validation: (Rule) => Rule.min(1) }),
    defineField({ name: 'descriptionEn', title: 'Description (English)', type: 'text', rows: 4 }),
    defineField({ name: 'descriptionHa', title: 'Description (Hausa)', type: 'text', rows: 4 }),
    defineField({ name: 'condition', title: 'Condition', type: 'string', options: { list: ['New', 'Refurbished', 'UK Used', 'Foreign Used'], layout: 'radio' }, initialValue: 'New' }),
    defineField({ name: 'warranty', title: 'Warranty', type: 'string' }),
    defineField({ name: 'featured', title: 'Featured Product', type: 'boolean', initialValue: false }),
  ],
})
