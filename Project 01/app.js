/**
 * NEOBRUTALISM PORTFOLIO WEB APPLICATION JAVASCRIPT
 * Personal Accomplishment Report - Miss Nuttarikha Anunjunya
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. SPLASH SCREEN HANDLER (Always runs on load & refresh)
  // =========================================================================
  const splashScreen = document.getElementById('splashScreen');
  const splashProgressBar = document.getElementById('splashProgressBar');
  const splashPercent = document.getElementById('splashPercent');
  const enterAppBtn = document.getElementById('enterAppBtn');

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      splashProgressBar.style.width = '100%';
      splashPercent.textContent = '100%';
      
      // Auto dismiss after a brief moment or enable instant button click
      setTimeout(() => {
        dismissSplash();
      }, 700);
    } else {
      splashProgressBar.style.width = `${progress}%`;
      splashPercent.textContent = `${progress}%`;
    }
  }, 100);

  function dismissSplash() {
    splashScreen.classList.add('fade-out');
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 400);
  }

  enterAppBtn.addEventListener('click', () => {
    clearInterval(progressInterval);
    splashProgressBar.style.width = '100%';
    splashPercent.textContent = '100%';
    dismissSplash();
  });


  // =========================================================================
  // 2. NAVIGATION & MOBILE MENU TOGGLE
  // =========================================================================
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const neoNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-item');

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      neoNav.classList.toggle('open');
    });
  }

  // Close mobile nav when clicking any item
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      neoNav.classList.remove('open');
      navLinks.forEach(n => n.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Active navigation highlight based on scroll position
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 160;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });


  // =========================================================================
  // 3. ACHIEVEMENTS FILTER TABS
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const awardCards = document.querySelectorAll('.award-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      awardCards.forEach(card => {
        if (filterVal === 'all' || card.getAttribute('data-cat') === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // =========================================================================
  // 4. MODAL LIGHTBOX (CV & DOCUMENT VIEWER)
  // =========================================================================
  const modal = document.getElementById('docViewerModal');
  const modalImg = document.getElementById('modalImg');
  const modalPageIndicator = document.getElementById('modalPageIndicator');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageSelect = document.getElementById('pageSelect');
  const openCvModalBtn = document.getElementById('openCvModalBtn');
  const downloadPageBtn = document.getElementById('downloadPageBtn');

  let currentPage = 1;
  const totalPages = 15;

  function loadModalPage(pageNum) {
    currentPage = Math.max(1, Math.min(pageNum, totalPages));
    modalImg.src = `assets/cv_pages/page_${currentPage}.png`;
    modalPageIndicator.textContent = `หน้าที่ ${currentPage} / ${totalPages}`;
    pageSelect.value = currentPage;

    prevPageBtn.disabled = (currentPage === 1);
    nextPageBtn.disabled = (currentPage === totalPages);
  }

  function openModal(initialPage = 1) {
    loadModalPage(initialPage);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open modal from view buttons
  document.querySelectorAll('.view-doc-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const page = parseInt(btn.getAttribute('data-page') || '1');
      openModal(page);
    });
  });

  if (openCvModalBtn) {
    openCvModalBtn.addEventListener('click', () => openModal(1));
  }

  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) loadModalPage(currentPage - 1);
  });

  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) loadModalPage(currentPage + 1);
  });

  pageSelect.addEventListener('change', (e) => {
    loadModalPage(parseInt(e.target.value));
  });

  downloadPageBtn.addEventListener('click', () => {
    window.open(`assets/cv_pages/page_${currentPage}.png`, '_blank');
  });

  // Keyboard navigation for modal
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && currentPage > 1) loadModalPage(currentPage - 1);
    if (e.key === 'ArrowRight' && currentPage < totalPages) loadModalPage(currentPage + 1);
  });


  // =========================================================================
  // 5. CONTACT FORM & vCard
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccessAlert.classList.remove('d-none');
      contactForm.reset();
      setTimeout(() => {
        formSuccessAlert.classList.add('d-none');
      }, 5000);
    });
  }

  // vCard generator & download
  const downloadVcardBtn = document.getElementById('downloadVcardBtn');
  if (downloadVcardBtn) {
    downloadVcardBtn.addEventListener('click', () => {
      const vcardData = `BEGIN:VCARD
VERSION:3.0
N:Anunjunya;Nuttarikha;;;
FN:นางสาวณัฐริกา อนันต์จรรยา
ORG:Svizz-One Corporation Ltd.;Technical Training & HRD
TITLE:Senior Training Officer (เจ้าหน้าที่ฝึกอบรมอาวุโส)
TEL;TYPE=CELL:0877162468
EMAIL:s6916011856072@email.kmutnb.ac.th
ADR;TYPE=HOME:;;83 Moo 10 Bang Pla;Bang Len;Nakhon Pathom;73130;Thailand
NOTE:KMUTNB S-MBR #17 Master's Student | Certified Master Trainer | ISO Internal Auditor
END:VCARD`;

      const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Nuttarikha_Anunjunya.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }


  // =========================================================================
  // 6. DASHBOARD & CHARTS (Chart.js)
  // =========================================================================
  // Neobrutalism Chart Global Defaults
  Chart.defaults.font.family = "'Prompt', 'Space Grotesk', sans-serif";
  Chart.defaults.font.weight = 'bold';
  Chart.defaults.color = '#000000';

  // Chart 1: Attendance Bar Chart
  const ctxAttendance = document.getElementById('attendanceChart').getContext('2d');
  const attendanceChart = new Chart(ctxAttendance, {
    type: 'bar',
    data: {
      labels: ['2563 (2020)', '2564 (2021)', '2565 (2022)', '2566 (2023)', '2567 (2024)', '2568 (2025)', '2569 (2026)'],
      datasets: [
        {
          label: 'พนักงานที่ได้รับการอบรม (คน)',
          data: [140, 195, 240, 290, 345, 380, 220],
          backgroundColor: '#FFE15D',
          borderColor: '#000000',
          borderWidth: 3,
          borderRadius: 0,
        },
        {
          type: 'line',
          label: 'ชั่วโมงฝึกอบรมสะสม (ชม.)',
          data: [35, 52, 68, 85, 98, 110, 65],
          borderColor: '#4D77FF',
          backgroundColor: '#4D77FF',
          borderWidth: 4,
          pointBackgroundColor: '#FF6B6B',
          pointBorderColor: '#000000',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { boxWidth: 16, padding: 14 }
        },
        tooltip: {
          backgroundColor: '#000000',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          borderWidth: 2,
          borderColor: '#FFE15D',
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { width: 3, color: '#000000' }
        },
        y: {
          grid: { color: '#E5E7EB' },
          border: { width: 3, color: '#000000' }
        }
      }
    }
  });

  // Chart 2: Course Category Breakdown (Doughnut)
  const ctxCategory = document.getElementById('categoryChart').getContext('2d');
  const categoryChart = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: [
        'Soft Skills & Teamwork (35%)',
        'Technical & On-the-Job Training (25%)',
        'Root Cause Analysis & Problem Solving (18%)',
        'Quality, Safety & ISO Internal Audit (12%)',
        'VDO Learning & E-Learning (10%)'
      ],
      datasets: [{
        data: [35, 25, 18, 12, 10],
        backgroundColor: [
          '#FFE15D',
          '#4D77FF',
          '#FF6B6B',
          '#00F0B5',
          '#B388FF'
        ],
        borderColor: '#000000',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 14,
            padding: 10,
            font: { size: 11, weight: 'bold' }
          }
        }
      }
    }
  });

  // Chart 3: Competency Matrix (Radar)
  const ctxCompetency = document.getElementById('competencyChart').getContext('2d');
  const competencyChart = new Chart(ctxCompetency, {
    type: 'radar',
    data: {
      labels: [
        'Training Needs Analysis (TNA)',
        'Course & Curriculum Design',
        'Public Speaking & Coaching',
        'Digital Media & VDO Production',
        'ISO & Compliance Standards',
        'Data Analysis & MIS Architecture'
      ],
      datasets: [
        {
          label: 'ระดับสมรรถนะเป้าหมาย (Benchmark)',
          data: [90, 90, 88, 85, 85, 88],
          borderColor: '#94A3B8',
          backgroundColor: 'rgba(148, 163, 184, 0.2)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 3
        },
        {
          label: 'สมรรถนะประเมินจริง (Current Mastery)',
          data: [96, 94, 98, 92, 95, 91],
          borderColor: '#000000',
          backgroundColor: 'rgba(255, 107, 107, 0.4)',
          borderWidth: 3,
          pointBackgroundColor: '#FFE15D',
          pointBorderColor: '#000000',
          pointBorderWidth: 2,
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 60,
          max: 100,
          ticks: { stepSize: 10, display: false },
          grid: { color: '#D1D5DB' },
          angleLines: { color: '#000000', lineWidth: 1.5 },
          pointLabels: {
            font: { size: 11, weight: 'bold' },
            color: '#000000'
          }
        }
      },
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 14 } }
      }
    }
  });

  // Chart 4: Learning Effectiveness (Pre-Test vs Post-Test)
  const ctxEffectiveness = document.getElementById('effectivenessChart').getContext('2d');
  const effectivenessChart = new Chart(ctxEffectiveness, {
    type: 'bar',
    data: {
      labels: ['RCA การแก้ปัญหา', 'การทำงานเป็นทีม', 'การรับมอบหมายงาน', 'การเพิ่มผลผลิต', 'Internal Auditor'],
      datasets: [
        {
          label: 'คะแนนก่อนอบรม (Pre-test)',
          data: [52.4, 58.1, 55.0, 50.8, 61.2],
          backgroundColor: '#E5E7EB',
          borderColor: '#000000',
          borderWidth: 3
        },
        {
          label: 'คะแนนหลังอบรม (Post-test)',
          data: [89.5, 92.4, 90.2, 88.6, 94.0],
          backgroundColor: '#00F0B5',
          borderColor: '#000000',
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 14 } }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { width: 3, color: '#000000' }
        },
        y: {
          min: 40,
          max: 100,
          grid: { color: '#E5E7EB' },
          border: { width: 3, color: '#000000' }
        }
      }
    }
  });

  // Dashboard Year Filter Logic
  const yearFilter = document.getElementById('yearFilter');
  const kpiTrained = document.getElementById('kpiTrained');
  const kpiCourses = document.getElementById('kpiCourses');
  const kpiHours = document.getElementById('kpiHours');
  const kpiSatisfaction = document.getElementById('kpiSatisfaction');

  yearFilter.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'recent') {
      // 2024 - 2026
      kpiTrained.textContent = '945+';
      kpiCourses.textContent = '14';
      kpiHours.textContent = '273+';
      kpiSatisfaction.textContent = '97.4%';

      attendanceChart.data.labels = ['2567 (2024)', '2568 (2025)', '2569 (2026)'];
      attendanceChart.data.datasets[0].data = [345, 380, 220];
      attendanceChart.data.datasets[1].data = [98, 110, 65];
    } else if (val === 'past') {
      // 2020 - 2023
      kpiTrained.textContent = '675+';
      kpiCourses.textContent = '12';
      kpiHours.textContent = '155+';
      kpiSatisfaction.textContent = '96.2%';

      attendanceChart.data.labels = ['2563 (2020)', '2564 (2021)', '2565 (2022)', '2566 (2023)'];
      attendanceChart.data.datasets[0].data = [140, 195, 240, 290];
      attendanceChart.data.datasets[1].data = [35, 52, 68, 85];
    } else {
      // All
      kpiTrained.textContent = '1,580+';
      kpiCourses.textContent = '26';
      kpiHours.textContent = '420+';
      kpiSatisfaction.textContent = '96.8%';

      attendanceChart.data.labels = ['2563 (2020)', '2564 (2021)', '2565 (2022)', '2566 (2023)', '2567 (2024)', '2568 (2025)', '2569 (2026)'];
      attendanceChart.data.datasets[0].data = [140, 195, 240, 290, 345, 380, 220];
      attendanceChart.data.datasets[1].data = [35, 52, 68, 85, 98, 110, 65];
    }
    attendanceChart.update();
  });

});
