// ---- SECURITY: escape all user text before it hits innerHTML ----
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

// ---- STATE ----
let skills = [];
let experiences = [];
let educations = [];
let languages = [];
let idCounter = 100;

// ---- TABS ----
function switchTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  el.classList.add('active');
}

// ---- ENTRIES ----
function addEntry(type) {
  const id = ++idCounter;
  if (type === 'experience') { experiences.push({ id }); renderExperiences(); }
  else if (type === 'education') { educations.push({ id }); renderEducations(); }
  else if (type === 'languages') { languages.push({ id }); renderLanguages(); }
}

function removeEntry(type, id) {
  if (type === 'experience') experiences = experiences.filter(e => e.id !== id);
  else if (type === 'education') educations = educations.filter(e => e.id !== id);
  else if (type === 'languages') languages = languages.filter(e => e.id !== id);
  renderAll();
}

function renderExperiences() {
  document.getElementById('experience-list').innerHTML = experiences.map((exp, i) => `
    <div class="entry-block">
      <div class="entry-header">
        <span class="entry-label">Job ${i + 1}</span>
        <button class="remove-btn" onclick="removeEntry('experience',${exp.id})" aria-label="Remove this experience entry">✕</button>
      </div>
      <div class="grid-2">
        <div class="form-group"><label for="exp-title-${exp.id}">Job Title</label><input id="exp-title-${exp.id}" /></div>
        <div class="form-group"><label for="exp-co-${exp.id}">Company</label><input id="exp-co-${exp.id}" placeholder="Company name" /></div>
      </div>
      <div class="grid-2">
        <div class="form-group"><label for="exp-s-${exp.id}">Start</label><input id="exp-s-${exp.id}" placeholder="MM/YYYY" /></div>
        <div class="form-group"><label for="exp-e-${exp.id}">End</label><input id="exp-e-${exp.id}" placeholder="MM/YYYY or Present" /></div>
      </div>
      <div class="form-group"><label for="exp-loc-${exp.id}">Location</label><input id="exp-loc-${exp.id}" placeholder="City, Country" /></div>
      <div class="form-group"><label for="exp-desc-${exp.id}">Key Responsibilities</label><textarea id="exp-desc-${exp.id}" placeholder="One responsibility per line..."></textarea></div>
    </div>`).join('');
}

function renderEducations() {
  document.getElementById('education-list').innerHTML = educations.map((edu, i) => `
    <div class="entry-block">
      <div class="entry-header">
        <span class="entry-label">Education ${i + 1}</span>
        <button class="remove-btn" onclick="removeEntry('education',${edu.id})" aria-label="Remove this education entry">✕</button>
      </div>
      <div class="form-group"><label for="edu-d-${edu.id}">Degree / Certificate</label><input id="edu-d-${edu.id}" placeholder="e.g. Bachelor of Arts" /></div>
      <div class="form-group"><label for="edu-s-${edu.id}">Institution</label><input id="edu-s-${edu.id}" placeholder="University or School name" /></div>
      <div class="form-group"><label for="edu-y-${edu.id}">Year</label><input id="edu-y-${edu.id}" placeholder="2020 - 2023" /></div>
      <div class="form-group"><label for="edu-n-${edu.id}">Notes (optional)</label><input id="edu-n-${edu.id}" placeholder="e.g. First class, specialization..." /></div>
    </div>`).join('');
}

function renderLanguages() {
  document.getElementById('languages-list').innerHTML = languages.map((lang, i) => `
    <div class="entry-block" style="display:flex;gap:10px;align-items:center;padding:12px 16px;">
      <input id="lang-n-${lang.id}" placeholder="Language" aria-label="Language name" style="flex:1" />
      <select id="lang-l-${lang.id}" aria-label="Proficiency level" style="flex:1">
        <option>Native</option><option>Fluent</option><option>Intermediate</option><option>Basic</option>
      </select>
      <button class="remove-btn" onclick="removeEntry('languages',${lang.id})" aria-label="Remove this language entry">✕</button>
    </div>`).join('');
}

function renderAll() { renderExperiences(); renderEducations(); renderLanguages(); }

// ---- SKILLS ----
function addSkill() {
  const inp = document.getElementById('skill-input');
  const val = inp.value.trim();
  if (val && !skills.includes(val)) { skills.push(val); renderSkills(); }
  inp.value = '';
  inp.focus();
}

function removeSkill(index) { skills.splice(index, 1); renderSkills(); }

function renderSkills() {
  document.getElementById('skills-list').innerHTML = skills.map((s, i) =>
    `<div class="skill-tag">${escapeHtml(s)}<span class="x" onclick="removeSkill(${i})" role="button" tabindex="0" aria-label="Remove skill ${escapeHtml(s)}" onkeydown="if(event.key==='Enter')removeSkill(${i})">✕</span></div>`
  ).join('');
}

// ---- COLLECT ----
function collect() {
  const get = id => document.getElementById(id)?.value?.trim() || '';
  return {
    name: get('name'),
    jobTitle: get('jobTitle'),
    email: get('email'),
    phone: get('phone'),
    location: get('location'),
    linkedin: get('linkedin'),
    summary: get('summary'),
    skills: [...skills],
    hobbies: get('hobbies').split(',').map(h => h.trim()).filter(Boolean),
    dob: get('dob'),
    gender: get('gender'),
    marital: get('marital'),
    nationality: get('nationality'),
    experiences: experiences.map(exp => ({
      title: get(`exp-title-${exp.id}`),
      company: get(`exp-co-${exp.id}`),
      start: get(`exp-s-${exp.id}`),
      end: get(`exp-e-${exp.id}`),
      location: get(`exp-loc-${exp.id}`),
      desc: get(`exp-desc-${exp.id}`),
    })),
    educations: educations.map(edu => ({
      degree: get(`edu-d-${edu.id}`),
      school: get(`edu-s-${edu.id}`),
      year: get(`edu-y-${edu.id}`),
      notes: get(`edu-n-${edu.id}`),
    })),
    languages: languages.map(l => ({
      name: get(`lang-n-${l.id}`),
      level: document.getElementById(`lang-l-${l.id}`)?.value || '',
    })),
  };
}

// ---- PREVIEW HTML ----
function buildPreviewHTML(d) {
  const e = escapeHtml;
  const sec = (title) => `<div class="rv-sec">${title}</div>`;

  const sidebarContent = `
    ${d.email ? `<div class="rv-text" style="margin-bottom:3px">📧 ${e(d.email)}</div>` : ''}
    ${d.phone ? `<div class="rv-text" style="margin-bottom:3px">📱 ${e(d.phone)}</div>` : ''}
    ${d.location ? `<div class="rv-text" style="margin-bottom:3px">📍 ${e(d.location)}</div>` : ''}
    ${d.linkedin ? `<div class="rv-text" style="margin-bottom:3px">🔗 ${e(d.linkedin)}</div>` : ''}

    ${d.skills.length ? `${sec('Skills')}${d.skills.map(s => `<div class="rv-text" style="margin-bottom:2px">• ${e(s)}</div>`).join('')}` : ''}

    ${d.languages.filter(l => l.name).length ? `${sec('Languages')}${d.languages.filter(l => l.name).map(l => `<div class="rv-text" style="margin-bottom:2px">${e(l.name)} — ${e(l.level)}</div>`).join('')}` : ''}

    ${d.dob || d.gender || d.marital || d.nationality ? `${sec('Details')}
      ${d.dob ? `<div class="rv-text">DOB: ${e(d.dob)}</div>` : ''}
      ${d.gender ? `<div class="rv-text">Gender: ${e(d.gender)}</div>` : ''}
      ${d.marital ? `<div class="rv-text">Status: ${e(d.marital)}</div>` : ''}
      ${d.nationality ? `<div class="rv-text">Nationality: ${e(d.nationality)}</div>` : ''}` : ''}

    ${d.hobbies.length ? `${sec('Hobbies')}${d.hobbies.map(h => `<div class="rv-text" style="margin-bottom:2px">• ${e(h)}</div>`).join('')}` : ''}
  `;

  const mainContent = `
    <div class="rv-name">${e(d.name) || 'Your Name'}</div>
    ${d.jobTitle ? `<div class="rv-jobtitle">${e(d.jobTitle)}</div>` : ''}

    ${d.summary ? `${sec('Summary')}<div class="rv-text" style="margin-bottom:4px">${e(d.summary)}</div>` : ''}

    ${d.experiences.filter(x => x.title).length ? `
      ${sec('Experience')}
      ${d.experiences.filter(x => x.title).map(exp => `
        <div style="margin-bottom:12px">
          <div class="rv-job-title">${e(exp.title)}</div>
          <div class="rv-job-meta">${e([exp.company, exp.location].filter(Boolean).join(' · '))}${exp.start ? ' | ' + e(exp.start) + ' – ' + e(exp.end || 'Present') : ''}</div>
          ${exp.desc ? exp.desc.split('\n').filter(Boolean).map(l => `<div class="rv-bullet">• ${e(l)}</div>`).join('') : ''}
        </div>`).join('')}` : ''}

    ${d.educations.filter(x => x.degree).length ? `
      ${sec('Education')}
      ${d.educations.filter(x => x.degree).map(edu => `
        <div style="margin-bottom:10px">
          <div class="rv-job-title">${e(edu.degree)}</div>
          <div class="rv-job-meta">${e(edu.school)}${edu.year ? ' | ' + e(edu.year) : ''}</div>
          ${edu.notes ? `<div class="rv-text">${e(edu.notes)}</div>` : ''}
        </div>`).join('')}` : ''}
  `;

  return `<div id="resume-preview">
    <div class="rv-sidebar">${sidebarContent}</div>
    <div class="rv-main">${mainContent}</div>
  </div>`;
}

// ---- PREVIEW MODAL ----
let lastFocusedEl = null;

function showPreview() {
  const d = collect();
  document.getElementById('resume-preview').innerHTML = buildPreviewHTML(d).replace('<div id="resume-preview">', '').replace(/<\/div>$/, '');
  lastFocusedEl = document.activeElement;
  const modal = document.getElementById('modal');
  modal.classList.add('open');
  document.addEventListener('keydown', handleModalKeydown);
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.removeEventListener('keydown', handleModalKeydown);
  if (lastFocusedEl) lastFocusedEl.focus();
}

function handleModalKeydown(e) {
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key !== 'Tab') return;
  const modal = document.getElementById('modal');
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

// ---- DOWNLOAD PDF ----
function downloadPDF() {
  const d = collect();
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });

  const W = 210, H = 297;
  const sideW = 55;
  const mainX = sideW + 6;
  const mainW = W - mainX - 10;

  // Sidebar background
  pdf.setFillColor(44, 62, 80);
  pdf.rect(0, 0, sideW, H, 'F');

  // Main background
  pdf.setFillColor(255, 255, 255);
  pdf.rect(sideW, 0, W - sideW, H, 'F');

  let sy = 18; // sidebar y
  let my = 18; // main y

  // ---- SIDEBAR ----
  const sideText = (text, size, bold, color) => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(text, sideW - 10);
    pdf.text(lines, 5, sy);
    sy += lines.length * (size * 0.4) + 1;
  };

  const sideSec = (title) => {
    sy += 3;
    pdf.setFillColor(255, 255, 255, 40);
    pdf.setDrawColor(255,255,255,60);
    pdf.line(5, sy, sideW - 5, sy);
    sy += 3;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(201, 168, 76);
    pdf.text(title.toUpperCase(), 5, sy);
    sy += 5;
  };

  if (d.email) sideText('✉ ' + d.email, 7.5, false, [220, 220, 220]);
  if (d.phone) sideText('✆ ' + d.phone, 7.5, false, [220, 220, 220]);
  if (d.location) sideText('⌖ ' + d.location, 7.5, false, [220, 220, 220]);
  if (d.linkedin) sideText('⇒ ' + d.linkedin, 7, false, [200, 200, 200]);

  if (d.skills.length) {
    sideSec('Skills');
    d.skills.forEach(s => { sideText('• ' + s, 7.5, false, [210, 210, 210]); sy += 0.5; });
  }

  if (d.languages.filter(l => l.name).length) {
    sideSec('Languages');
    d.languages.filter(l => l.name).forEach(l => { sideText(l.name + ' — ' + l.level, 7.5, false, [210, 210, 210]); sy += 0.5; });
  }

  const hasDetails = d.dob || d.gender || d.marital || d.nationality;
  if (hasDetails) {
    sideSec('Details');
    if (d.dob) sideText('DOB: ' + d.dob, 7.5, false, [210, 210, 210]);
    if (d.gender) sideText('Gender: ' + d.gender, 7.5, false, [210, 210, 210]);
    if (d.marital) sideText('Status: ' + d.marital, 7.5, false, [210, 210, 210]);
    if (d.nationality) sideText('Nationality: ' + d.nationality, 7.5, false, [210, 210, 210]);
  }

  if (d.hobbies.length) {
    sideSec('Hobbies');
    d.hobbies.forEach(h => { sideText('• ' + h, 7.5, false, [210, 210, 210]); sy += 0.5; });
  }

  // ---- MAIN ----
  const mainText = (text, size, bold, color, x, maxW) => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(text, maxW || mainW);
    pdf.text(lines, x || mainX, my);
    my += lines.length * (size * 0.38) + 1;
    return lines.length;
  };

  const mainSec = (title) => {
    my += 3;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(44, 62, 80);
    pdf.text(title.toUpperCase(), mainX, my);
    my += 1;
    pdf.setDrawColor(44, 62, 80);
    pdf.setLineWidth(0.5);
    pdf.line(mainX, my, W - 10, my);
    my += 5;
  };

  // Name
  pdf.setFontSize(26);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(44, 62, 80);
  pdf.text(d.name || 'Your Name', mainX, my);
  my += 8;

  if (d.jobTitle) {
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    pdf.text(d.jobTitle, mainX, my);
    my += 7;
  }

  if (d.summary) {
    mainSec('Summary');
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    const lines = pdf.splitTextToSize(d.summary, mainW);
    pdf.text(lines, mainX, my);
    my += lines.length * 3.8 + 3;
  }

  const expFiltered = d.experiences.filter(e => e.title);
  if (expFiltered.length) {
    mainSec('Experience');
    expFiltered.forEach(exp => {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text(exp.title, mainX, my); my += 5;

      const meta = [exp.company, exp.location].filter(Boolean).join(' · ') + (exp.start ? '  |  ' + exp.start + ' – ' + (exp.end || 'Present') : '');
      if (meta) {
        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(140, 140, 140);
        pdf.text(meta, mainX, my); my += 5;
      }

      if (exp.desc) {
        exp.desc.split('\n').filter(Boolean).forEach(line => {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(80, 80, 80);
          const ls = pdf.splitTextToSize('• ' + line, mainW - 4);
          pdf.text(ls, mainX + 2, my);
          my += ls.length * 3.8;
        });
      }
      my += 3;
    });
  }

  const eduFiltered = d.educations.filter(e => e.degree);
  if (eduFiltered.length) {
    mainSec('Education');
    eduFiltered.forEach(edu => {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 30, 30);
      pdf.text(edu.degree, mainX, my); my += 5;

      const meta = edu.school + (edu.year ? '  |  ' + edu.year : '');
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(140, 140, 140);
      pdf.text(meta, mainX, my); my += 4;

      if (edu.notes) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(90, 90, 90);
        pdf.text(edu.notes, mainX, my); my += 4;
      }
      my += 2;
    });
  }

  pdf.save((d.name || 'Resume') + '_Resume.pdf');
  showToast('✓ Resume downloaded!');
}

document.getElementById('footer-year').textContent = new Date().getFullYear();

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
