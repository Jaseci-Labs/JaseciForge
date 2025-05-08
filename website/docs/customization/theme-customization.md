# Theme Customization

Jaseci Forge allows you to easily customize the look and feel of your application by modifying theme variables such as colors, fonts, and spacing.

## How to Customize the Theme

### 1. Edit CSS Variables
Most theme settings are controlled via CSS variables in `website/src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #ED4B34;
  --ifm-font-family-base: 'Inter', sans-serif;
  /* ...other variables... */
}
```

Change these values to match your brand or design preferences.

### 2. Add a Custom Theme
You can extend or override the default theme by creating your own CSS or using a CSS-in-JS solution. Import your custom styles in `docusaurus.config.js`:

```js
module.exports = {
  themeConfig: {
    theme: {
      customCss: require.resolve('./src/css/custom.css'),
    },
  },
};
```

### 3. Preview Changes
Run the development server to see your changes live:

```bash
npm run start
```

## Tips
- Use browser dev tools to experiment with styles.
- Document your theme changes for future maintainers.

Theme customization helps you create a unique and branded user experience. 