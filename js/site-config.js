/* Edit this file to fill in the details the Astra profile did not include.
   Leave a value empty ('') to keep its placeholder / hide it. */
window.SITE = {
  address: '',          // e.g. 'Street, City\nCountry'  (\n makes a new line)
  email: '',            // e.g. 'info@yourdomain.com'
  phone: '',            // e.g. '+000 000 000 000'
  linkedin: '',         // full URL; the icon is hidden when empty
  facebook: '',
  youtube: '',
  clientPortalUrl: '',  // client login page URL; '#' placeholder when empty

  // Hero background video. After you add the files, set enabled to true.
  heroVideo: {
    enabled: true,
    mp4: 'assets/video/hero.mp4',
    webm: 'assets/video/hero.webm'
  },

  // "How We Work" panel background video.
  panelVideo: {
    enabled: true,
    mp4: 'assets/video/panel-how-we-work.mp4',
    webm: 'assets/video/panel-how-we-work.webm'
  },

  // Consultation form. Paste a form-handling URL (accepts a JSON POST) to send real requests.
  // Empty = demo mode: the form validates and shows a success state but sends nothing.
  formEndpoint: ''
};
