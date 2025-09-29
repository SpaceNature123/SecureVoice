# SecureVoice - Anonymous Complaint Platform

A modern, secure, and anonymous platform for reporting workplace concerns, harassment, discrimination, and ethical violations.

## 📁 File Structure

```
project/
│
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── data.js            # Data structures and utility functions
├── app.js             # Application logic and functionality
└── README.md          # Documentation (this file)
```

## 🚀 Features

### Core Features
- **100% Anonymous Submissions** - No login or personal information required
- **Unique Tracking IDs** - Track complaint status without revealing identity
- **Priority Levels** - Urgent, High, Medium, Low priority classification
- **Category System** - Harassment, Discrimination, Safety, Ethics, Other
- **Status Tracking** - Pending → Reviewing → Resolved workflow
- **Advanced Filtering** - Filter by category, status, priority, and search
- **Real-time Statistics** - Dashboard with complaint analytics
- **Data Export** - Export complaints as CSV or JSON
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### User Interface
- Modern gradient hero section with animations
- Smooth page transitions
- Toast notifications for user feedback
- Interactive feature cards with hover effects
- Mobile-friendly hamburger menu
- Floating animations and visual effects

### Admin Panel
- View all complaints sorted by priority
- Update complaint status (cycle through pending/reviewing/resolved)
- Delete complaints with confirmation
- Export data for reporting
- Comprehensive statistics dashboard

## 🛠️ Setup

1. **Download all files** to the same directory:
   - `index.html`
   - `styles.css`
   - `data.js`
   - `app.js`

2. **Open `index.html`** in a web browser

3. **No server required** - runs entirely in the browser

## 📋 Usage Guide

### For Users (Submitting Complaints)

1. **Navigate to the app** by clicking "Launch App" or the navigation button
2. **Fill out the form**:
   - Select a category
   - Enter a subject line
   - Provide detailed description
   - Optionally add location/department
   - Select priority level
3. **Submit** and save your tracking ID
4. **Track your complaint** using the "Track Complaint" tab with your ID

### For Administrators

1. Go to the **Admin Panel** tab
2. **View statistics** at the top showing complaint metrics
3. **Manage complaints**:
   - Click "Update Status" to cycle through statuses
   - Click "Delete" to remove complaints (with confirmation)
4. **Export data** by clicking the "Export Data" button
5. Choose CSV or JSON format for export

### Filtering and Search

- Use dropdown filters for category, status, and priority
- Use the search box to find specific complaints by ID, subject, or description
- Filters can be combined for precise results

## 🎨 Customization

### Colors (in `styles.css`)
```css
:root {
    --primary: #2b6cb0;        /* Main brand color */
    --primary-dark: #2c5282;   /* Darker shade */
    --primary-light: #1e40af;  /* Lighter shade */
    --success: #48bb78;         /* Success messages */
    --danger: #f56565;          /* Danger/delete actions */
    --warning: #ed8936;         /* Warning messages */
}
```

### Categories (in `data.js`)
```javascript
categories: [
    { value: 'harassment', label: 'Harassment' },
    { value: 'discrimination', label: 'Discrimination' },
    // Add more categories here
]
```

### Features Content (in `data.js`)
Edit the `features` and `allFeatures` arrays to customize what appears on your pages.

## 🔒 Data Storage

**Important**: This implementation stores data **in memory only**. Data will be lost when the page is refreshed.

### To Add Persistent Storage:

If you want complaints to persist between sessions, you'll need to:

1. **Use a backend database** (recommended for production)
   - Set up a server with Node.js/Express
   - Connect to MongoDB, PostgreSQL, or another database
   - Update `app.js` to make API calls instead of storing in memory

2. **Or use browser storage** (not recommended for sensitive data)
   - Note: Not suitable for truly anonymous/secure complaints
   - Can be cleared by users or browser settings

## 📱 Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Security Notes

This is a **demo/prototype** application. For production use:

1. **Backend Required**: Implement server-side validation and storage
2. **HTTPS**: Always use HTTPS to encrypt data in transit
3. **Input Sanitization**: Add server-side input validation
4. **Rate Limiting**: Prevent spam submissions
5. **Database Security**: Use proper database security measures
6. **No Client-Side Secrets**: Never store sensitive data in browser
7. **Audit Logging**: Track who accessed what (admin side only)

## 🎯 Future Enhancements

Potential features to add:

- [ ] Email notifications for complaint updates
- [ ] File attachment support
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced analytics with charts
- [ ] Automated status updates based on rules
- [ ] Comment/messaging system (maintaining anonymity)
- [ ] Integration with ticketing systems
- [ ] PDF report generation
- [ ] Advanced search with date ranges

## 🐛 Troubleshooting

### Page won't load
- Ensure all files are in the same directory
- Check browser console for errors
- Make sure file names match exactly (case-sensitive)

### Styles not showing
- Verify `styles.css` is in the same folder as `index.html`
- Check that the `<link>` tag in HTML points to correct file
- Clear browser cache

### Functions not working
- Ensure both `data.js` and `app.js` are loaded
- Check browser console for JavaScript errors
- Make sure scripts are loaded in correct order (data.js before app.js)

### Toast notifications not appearing
- Check that the toast div exists in HTML
- Verify CSS animations are not disabled
- Check z-index if other elements are covering it

## 📄 License

This is a demonstration project. Feel free to use and modify for your needs.

## 🤝 Contributing

To improve this project:

1. Add new features in modular functions
2. Keep data separate from logic
3. Document your changes
4. Test on multiple browsers
5. Maintain the existing code style

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review browser console for errors
- Ensure all files are properly linked

---

**Built with modern web technologies for secure, anonymous complaint management.**
