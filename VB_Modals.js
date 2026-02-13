<style>
  /* --- Base Modal Styles --- */
  .custom-modal { display: none; position: fixed; inset: 0; z-index: 999999; }
  .custom-modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); cursor: pointer; }
  .custom-modal-container { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 20px; pointer-events: none; }
    
  /* --- White Box Styles --- */
  .custom-modal-box { 
    position: relative; background: white; width: 100%; border-radius: 0px; 
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; 
    pointer-events: auto; display: flex; flex-direction: column; 
    font-family: var(--body-font-font-family), sans-serif; 
  }

  /* --- Close Button Generic --- */
  .custom-close-btn { 
    border: none; background: none; cursor: pointer; border-radius: 0px; font-size: 28px; line-height: 1; 
    color: #fff; padding: 0 4px; transition: color 0.2s; 
  }
  .custom-close-btn:hover { color: #eee; }

  /* --- Pipedrive-specific close button --- */
  #pipedrive-modal .custom-close-btn {
    background: #737a6a; /* Updated Brand Color */
    transition: background 0.2s, color 0.2s;
  }
  #pipedrive-modal .custom-close-btn:hover {
    background: #8d9285; /* Updated Hover Color */
    color: #fff;
  }

  /* --- PDF & G-Drive & Matterport Specific Close Button --- */
  .pdf-close-btn {
    border: none; 
    background: #737a6a; /* Updated Brand Color */
    cursor: pointer; 
    font-size: 30px; 
    line-height: 1; 
    color: #fff; 
    padding: 0 10px; 
    border-radius: 0px; 
    transition: background-color 0.2s;
  }
  .pdf-close-btn:hover {
    background-color: #8d9285; /* Updated Hover Color */
  }

  /* --- PDF Book Table Button --- */
  .pdf-book-btn {
    position: absolute; 
    bottom: 20px; 
    left: 20px; 
    z-index: 20; 
    display: inline-block; 
    text-decoration: none; 
    background: #737a6a; /* Updated Brand Color */
    color: #ffffff; 
    padding: 12px 18px; 
    border-radius: 0px; 
    font-size: 14px; 
    font-weight: 600; 
    font-family: var(--body-font-font-family), sans-serif; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    border: none; 
    transition: background-color 0.2s; 
    white-space: nowrap;
  }
  .pdf-book-btn:hover {
    background-color: #8d9285; /* Updated Hover Color */
    opacity: 1; 
  }

  /* --- Loader --- */
  .custom-loader { 
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
    color: #999; font-family: var(--body-font-font-family), sans-serif; z-index: 5; 
  }

  /* --- Specific Modal Tweaks --- */
  #pipedrive-box { max-width: 700px; height: 85vh; }
  /* Keep Matterport at 95vh */
#matterport-modal-box { 
  max-width: 1100px; 
  height: 95vh; 
}

/* Give the PDF box a landscape aspect ratio instead of a fixed height */
#gdrive-pdf-box { 
  max-width: 1100px; 
  width: 100%;
  aspect-ratio: 1.4 / 1; /* Matches a standard landscape document perfectly */
  max-height: 90vh; /* Ensures it never gets taller than the screen on weirdly shaped monitors */
}
  #klaviyo-box { max-width: 500px; background: #737a6a; /* Updated Brand Color */ }
    
  /* Mobile PDF Height Override */
  @media (max-width: 640px) {
    #gdrive-pdf-box { height: 80vh !important; }
    #matterport-modal-box { height: 85vh !important; } 
  }

  /* --- Pipedrive Iframe Styles --- */
  #pipedrive-frame {
    height: calc(100% + 20px);
    top: -20px;
  }
  @media (max-width: 640px) {
    #pipedrive-frame {
      height: calc(100% + 5px);
      top: -5px;
    }
  }
</style>

<div id="pipedrive-modal" class="custom-modal">
  <div class="custom-modal-backdrop close-trigger"></div>
  <div class="custom-modal-container">
    <div id="pipedrive-box" class="custom-modal-box">
      <div style="position: absolute; top: 18px; right: 32px; z-index: 20;">
        <button class="custom-close-btn close-trigger">&times;</button>
      </div>
      <div style="flex-grow: 1; position: relative; background: #fff;">
        <div id="pd-loader" class="custom-loader">Loading form...</div>
         <iframe id="pipedrive-frame" src="about:blank" style="width: 100%; border: none; position: relative; z-index: 10;"></iframe>
      </div>
    </div>
  </div>
</div>

<div id="gdrive-pdf-modal" class="custom-modal" style="z-index: 999998;">
  <div class="custom-modal-backdrop close-trigger"></div>
  <div class="custom-modal-container">
    <div id="gdrive-pdf-box" class="custom-modal-box">
        
      <div style="position: absolute; top: 17px; right: 65px; z-index: 20;">
        <button class="pdf-close-btn close-trigger">&times;</button>
      </div>
        
      <div style="flex-grow: 1; position: relative; background: #333;">
        <div id="gdrive-pdf-loader" class="custom-loader">Loading document...</div>
        <iframe id="gdrive-pdf-frame" src="about:blank" style="width: 100%; height: 100%; border: none; position: relative; z-index: 10;"></iframe>
      </div>

      <a class="pdf-book-btn"
         href="https://www.sevenrooms.com/explore/vivatbacchus/reservations/create/search?venues=vivatbacchusfarringdon%2Cvivatbacchuslondonbridge" 
         target="_blank" 
         rel="noopener">
         Book A Table
      </a>

    </div>
  </div>
</div>

<div id="matterport-modal" class="custom-modal" style="z-index: 999998;">
    <div class="custom-modal-backdrop close-trigger"></div>
    <div class="custom-modal-container">
        <div id="matterport-modal-box" class="custom-modal-box">
              
            <div style="position: absolute; top: 17px; right: 22px; z-index: 20;">
                <button class="pdf-close-btn close-trigger">&times;</button>
            </div>
              
            <div style="flex-grow: 1; position: relative; background: #000;">
                <div id="matterport-loader" class="custom-loader">Loading tour...</div>
                <iframe id="matterport-frame" src="about:blank" style="width: 100%; height: 100%; border: none; position: relative; z-index: 10;" allow="xr-spatial-tracking; vr; gyroscope; accelerometer; fullscreen; autoplay; execution-while-out-of-viewport; execution-while-not-rendered; web-share"></iframe>
            </div>

        </div>
    </div>
</div>

<div id="klaviyo-modal" class="custom-modal" style="z-index: 999997;">
  <div class="custom-modal-backdrop close-trigger"></div>
  <div class="custom-modal-container">
    <div id="klaviyo-box" class="custom-modal-box">
      <div style="position: absolute; top: 8px; right: 12px; z-index: 10;">
        <button class="custom-close-btn close-trigger">&times;</button>
      </div>
      <div style="padding: 40px 20px 20px 20px;">
        <div class="klaviyo-form-Y8EWr2"></div> 
        <div id="klaviyo-loader" class="custom-loader" style="display:none; position: relative; top:auto; left:auto; transform:none; text-align:center; padding: 20px;">Loading newsletter...</div>
      </div>
    </div>
  </div>
</div>


<script>
document.addEventListener("DOMContentLoaded", function() {

  /* === 1. CLOSE LOGIC === */
  function closeAllModals() {
    document.querySelectorAll('.custom-modal').forEach(m => m.style.display = 'none');
    document.body.style.overflow = 'auto';

    // Reset iframes
    ['pipedrive-frame', 'gdrive-pdf-frame', 'matterport-frame'].forEach(id => {
      const frame = document.getElementById(id);
      if (frame) frame.src = 'about:blank';
    });
  }

  // Click listener for close buttons and backdrops
  document.querySelectorAll('.custom-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-trigger') || e.target.closest('.close-trigger')) {
        e.stopPropagation();
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });

  /* === 2. PIPEDRIVE LOGIC === */
  const pdLinks = document.querySelectorAll('a[href*="webforms.pipedrive.com"]');
  const pdModal = document.getElementById('pipedrive-modal');
  const pdIframe = document.getElementById('pipedrive-frame');
  const pdLoader = document.getElementById('pd-loader');

  pdLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (!pdModal) return;

      pdLoader.style.display = 'block';
      pdIframe.onload = () => { pdLoader.style.display = 'none'; };
      pdIframe.src = link.getAttribute('href');

      pdModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  /* === 3. G-DRIVE PDF LOGIC === */
  const gDriveModal = document.getElementById('gdrive-pdf-modal');
  const gDriveIframe = document.getElementById('gdrive-pdf-frame');
  const gDriveLoader = document.getElementById('gdrive-pdf-loader');

  // Helper to handle G-Drive loading state
  function gDriveIframeLoadHandler() {
      if (gDriveLoader) gDriveLoader.style.display = 'none';
      if (gDriveIframe) gDriveIframe.removeEventListener('load', gDriveIframeLoadHandler);
  }

  // Global listener for G-Drive Links
  document.body.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    // check if link contains drive.google.com/file/d/
    if (link && link.href.includes('drive.google.com/file/d/')) {
        event.preventDefault();

        if (!gDriveModal || !gDriveIframe) return;

        // Extract ID
        const match = link.href.match(/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            const fileId = match[1];
            const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

            if (gDriveLoader) gDriveLoader.style.display = 'block';
            gDriveIframe.addEventListener('load', gDriveIframeLoadHandler);
            gDriveIframe.src = embedUrl;

            gDriveModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Could not extract G-Drive File ID');
        }
    }
  });
    
  /* === 4. VIRTUAL TOUR LOGIC (Matterport & 3DPlayer) === */
  const mpModal = document.getElementById('matterport-modal');
  const mpIframe = document.getElementById('matterport-frame');
  const mpLoader = document.getElementById('matterport-loader');

  function mpIframeLoadHandler() {
      if (mpLoader) mpLoader.style.display = 'none';
      if (mpIframe) mpIframe.removeEventListener('load', mpIframeLoadHandler);
  }

  // Global listener for Virtual Tour Links
  document.body.addEventListener('click', function(event) {
      const link = event.target.closest('a');
      if (link && (link.href.includes('my.matterport.com') || link.href.includes('3dplayer.online'))) {
          event.preventDefault();

          if (!mpModal || !mpIframe) return;

          const tourUrl = link.href;

          if (mpLoader) mpLoader.style.display = 'block';
          mpIframe.addEventListener('load', mpIframeLoadHandler);
          mpIframe.src = tourUrl;

          mpModal.style.display = 'block';
          document.body.style.overflow = 'hidden';
      }
  });


  /* === 5. KLAVIYO LOGIC === */
  // Updated selector to support both "join-newsletter" and "newsletter"
  const klaviyoLinks = document.querySelectorAll('a[href="#join-newsletter"], a[href="#newsletter"]'); 
  const klaviyoModal = document.getElementById('klaviyo-modal');
  const klaviyoLoader = document.getElementById('klaviyo-loader');
  let klaviyoLoaded = false;

  klaviyoLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (!klaviyoModal) return;

      klaviyoModal.style.display = 'block';
      document.body.style.overflow = 'hidden';

      if (!klaviyoLoaded) {
        if (klaviyoLoader) klaviyoLoader.style.display = 'block';
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        // Klaviyo Company ID: RC8UeV
        script.src = 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=RC8UeV';
        script.onload = () => {
          if (klaviyoLoader) klaviyoLoader.style.display = 'none';
        };
        document.head.appendChild(script);
        klaviyoLoaded = true;
      }
    });
  });

});
</script>

<script>
document.addEventListener('click', function(e) {
  // SAFETY: Ignore automated clicks
  if (!e.isTrusted) return;

  const clickedButton = e.target.closest('.accordion-item__click-target');
  const clickedInsideAccordion = e.target.closest('.sqs-block-accordion');

  // SCENARIO A: User opens an Accordion (Close ALL others)
  if (clickedButton) {
    setTimeout(function() {
      const allOpenButtons = document.querySelectorAll('.accordion-item__click-target[aria-expanded="true"]');
      allOpenButtons.forEach(button => {
        if (button !== clickedButton) {
          button.click();
        }
      });
    }, 10);
  }
  // SCENARIO B: User clicks background (Close EVERYTHING)
  else if (!clickedInsideAccordion) {
    const allOpenButtons = document.querySelectorAll('.accordion-item__click-target[aria-expanded="true"]');
    allOpenButtons.forEach(button => {
      button.click();
    });
  }
});
</script>
