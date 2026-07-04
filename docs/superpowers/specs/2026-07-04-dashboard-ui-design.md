# Dashboard UI Redesign Specification

## Goal
Improve the Beduine customer dashboard UI design to match the user's reference screenshot collage while keeping all pages integrated with live customer-scoped backend data.

## Requirements

### Sidebar & Header
- **Sidebar Menu**: Ensure active items use background color `#006DF5` and text is white. Keep the current circular logo layout. Keep the menu item label "TRC / Travel Reward Credits" as it is.
- **Header Profile**: Replace initials placeholder avatar with `/images/avatar.jpg` image. Under the user's name, display "Explorer" instead of their UID.

### Overview Screen
- **Welcome Banner**: Uses a sky-blue/blue gradient background. Display `/images/avatar.jpg` as the avatar, and add an absolute-positioned white mountains SVG outline and floating plane illustration on the right. Show "UID: {model.profile.uid}".
- **Metric Cards**:
  - Four stats in a row: Total Bookings, Upcoming Trips, Total Spent, and Discount Credits.
  - Upgrade the layout: Left-aligned icon inside a light-colored rounded square background; right-aligned labels, values, and blue navigation text links.
- **Next Trip Card**: Dark overlay on a Kashmir background image. Brand-colored orange button "View Details" to navigate to My Bookings.
- **Recent Activity**: Displays list items with styled colored circle icons for each activity type. "View all activity" link at the bottom.
- **Sunday Lucky Draw Card**: Blue gradient card with trophy image floating on the right. Next Sunday date calculated dynamically. Orange brand button to open TRC/Lucky Draw page.

### Plan Screen
- **Active Plan**: Upgraded to a dark blue gradient card with the earth globe rotating on the right and an orange "View Benefits" button. Shows price (`₹5,000 / year` for international gold).

### Bookings Screen
- **Tabs**: Filter tabs for bookings, filter icon next to tabs.
- **Table Pagination**: Client-side pagination displaying "Showing 1 to X of Y entries".

### Payments Screen
- **Metrics**: Styled colored Metric cards.
- **Receipts**: Replace text buttons under "Receipt" column with a download/document icon.

### Profile Screen
- **Layout**: Split into left card (avatar photo, name, email) and right card (phone, DOB, gender, address).

## Verification Plan
- Verify all unit and integration tests continue to pass.
- Manually run the dev server and verify the layout.
