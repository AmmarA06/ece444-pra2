/*
 * Projects: dynamic rendering, tag filtering, and search.
 *
 * Cards are built from the `projects` array below rather than being written
 * out in index.html, so adding a project means adding one object here.
 * Two are shown initially; "Load More" reveals the rest without a reload.
 */

(function () {
  'use strict';

  var projects = [
    {
      title: 'SAMCraft',
      image: 'assets/img/projects/samcraft.jpg',
      alt: 'SAMCraft turning a photo into a Minecraft build',
      blurb: 'Turns photos into Minecraft builds &mdash; click an object, get a schematic.',
      tags: ['Computer Vision', '3D'],
      details: [
        '<b>Tools:</b> Python, SAM 2, image-to-3D, voxelization',
        "Click any object in an image and it's segmented with SAM 2, then reconstructed into a 3D mesh.",
        'Voxelized into blocks using CIEDE2000 perceptual colour matching so the palette actually looks right in-game.',
        'Exports directly to <code>.schem</code> and <code>.litematic</code> schematics.'
      ],
      github: 'https://github.com/AmmarA06/SAMCraft',
      live: null
    },
    {
      title: 'Discovery',
      image: 'assets/img/projects/discovery.jpg',
      alt: 'Discovery pan-tilt tracking system',
      blurb: 'A 2-axis pan-tilt vision rig for high-precision 3D interaction tracking.',
      tags: ['Computer Vision', 'Hardware'],
      details: [
        '<b>Tools:</b> Grounding DINO, LiDAR, FastAPI, SQLite, React, Framer Motion',
        'A servo-driven pan-tilt mount expands the effective field of view of an Xbox Kinect for 3D tracking.',
        'Custom vision pipeline identifies real-time interaction events and logs them into a spatial database.',
        'Front-end dashboard visualizes high-fidelity coordinate telemetry as it streams in.'
      ],
      github: 'https://github.com/AmmarA06/Discovery',
      live: null
    },
    {
      title: 'Shop3D',
      image: 'assets/img/projects/shop3d.jpg',
      alt: 'Shop3D interactive product viewer',
      blurb: 'A Shopify app that turns flat product photos into interactive 3D models.',
      tags: ['3D', 'Web'],
      details: [
        '<b>Tools:</b> GraphQL, FastAPI, three.js, Celery, TripoSR, Redis, SQL',
        'Customers can rotate, zoom, and inspect products directly on the storefront.',
        "Reconstruction runs asynchronously through a Celery queue so the merchant isn't blocked waiting on a model.",
        'Integrates with the Shopify admin via GraphQL.'
      ],
      github: 'https://github.com/AmmarA06/Shop3D',
      live: null
    },
    {
      title: 'Synthra',
      image: 'assets/img/projects/synthra.jpg',
      alt: 'Synthra browser extension',
      blurb: 'A browser extension that turns any webpage into study-ready notes.',
      tags: ['AI', 'Web'],
      details: [
        '<b>Tools:</b> Chrome Extension APIs, Gemini, Notion API, Python',
        'Extracts and restructures page content into organized notes rather than a flat summary.',
        'Pushes the result straight into Notion so notes land where you already work.'
      ],
      github: 'https://github.com/AmmarA06/Synthra',
      live: null
    },
    {
      title: 'Rift Rewind',
      image: 'assets/img/projects/rift-rewind.jpg',
      alt: 'Rift Rewind year in review',
      blurb: 'A League of Legends year-in-review that coaches as much as it celebrates.',
      tags: ['AI', 'Data Viz'],
      details: [
        '<b>Tools:</b> React, AWS, Bedrock, Flask, D3.js, Riot API',
        'Blends data visualization with generated coaching feedback across a full season of matches.',
        'Highlights measurable progress and points at concrete next steps for improvement.'
      ],
      github: 'https://github.com/KenC2006/Rift_Rewind',
      live: 'https://rift-rewind-kohl.vercel.app/'
    },
    {
      title: 'CodeType',
      image: 'assets/img/projects/codetype.png',
      alt: 'CodeType typing test',
      blurb: 'Monkeytype, but for programming languages.',
      tags: ['Web'],
      details: [
        '<b>Tools:</b> React, TypeScript, Vite, Supabase',
        'Typing practice on real code, where the brackets and symbols are the hard part.',
        'Tracks WPM and accuracy per language with persisted results.'
      ],
      github: 'https://github.com/AmmarA06/CodeType',
      live: null
    }
  ];

  var PAGE_SIZE = 2;

  var list = document.getElementById('project-list');
  var filters = document.getElementById('project-filters');
  var search = document.getElementById('project-search');
  var loadMore = document.getElementById('load-more');
  var empty = document.getElementById('project-empty');

  if (!list || !loadMore) {
    return;
  }

  var visibleCount = PAGE_SIZE;
  var activeTag = 'All';
  var query = '';

  // Strip markup so <b> and <code> in details don't produce false search hits.
  function plain(html) {
    return String(html).replace(/<[^>]*>/g, ' ');
  }

  function haystack(project) {
    return [project.title, project.blurb, project.tags.join(' '), project.details.join(' ')]
      .map(plain)
      .join(' ')
      .toLowerCase();
  }

  function matches(project) {
    var tagOk = activeTag === 'All' || project.tags.indexOf(activeTag) !== -1;
    var queryOk = query === '' || haystack(project).indexOf(query) !== -1;
    return tagOk && queryOk;
  }

  function visibleProjects() {
    return projects.filter(matches);
  }

  function actionLink(href, label, tooltip, icon) {
    return '<a aria-label="' + label + '" href="' + href + '" target="_blank" data-position="top" ' +
      'data-tooltip="' + tooltip + '" ' +
      'class="btn-floating btn-large waves-effect waves-light blue-grey tooltipped">' +
      '<i class="fa ' + icon + '"></i></a>';
  }

  function cardHtml(project) {
    var actions = '';
    if (project.live) {
      actions += actionLink(project.live, 'View ' + project.title + ' live', 'View Online', 'fa-external-link');
    }
    if (project.github) {
      actions += actionLink(project.github, 'Visit the GitHub repo for ' + project.title, 'View Source', 'fa-github');
    }

    var bullets = project.details.map(function (item) {
      return '<li>' + item + '</li>';
    }).join('');

    return '' +
      '<div class="col s12 m6 l4">' +
      '<div class="card medium">' +
      '<div class="card-image waves-effect waves-block waves-light">' +
      '<img alt="' + project.alt + '" src="' + project.image + '" style="height: 100%; width: 100%" class="activator" />' +
      '</div>' +
      '<div class="card-content">' +
      '<span class="card-title activator teal-text hoverline">' + project.title +
      '<i class="mdi-navigation-more-vert right"></i></span>' +
      '<p>' + project.blurb + '</p>' +
      '</div>' +
      '<div class="card-reveal">' +
      '<span class="card-title grey-text"><small>Details</small><i class="mdi-navigation-close right"></i></span>' +
      '<ul>' + bullets + '</ul>' +
      '<div class="card-action">' + actions + '</div>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function renderFilters() {
    var tags = ['All'];
    projects.forEach(function (project) {
      project.tags.forEach(function (tag) {
        if (tags.indexOf(tag) === -1) {
          tags.push(tag);
        }
      });
    });

    filters.innerHTML = tags.map(function (tag) {
      var isActive = tag === activeTag;
      return '<button type="button" class="project-filter' + (isActive ? ' is-active' : '') +
        '" data-tag="' + tag + '" aria-pressed="' + isActive + '">' + tag + '</button>';
    }).join('');
  }

  function render() {
    var shown = visibleProjects();
    var slice = shown.slice(0, visibleCount);

    list.innerHTML = slice.map(cardHtml).join('');
    empty.hidden = shown.length !== 0;

    // Materialize binds tooltips once on ready, so freshly injected ones need it again.
    if (window.jQuery) {
      window.jQuery('#project-list .tooltipped').tooltip();
    }

    // Requirement: hide the button once everything is on screen.
    loadMore.hidden = shown.length <= visibleCount;
    loadMore.textContent = 'Load More (' + (shown.length - slice.length) + ')';
  }

  function resetPaging() {
    visibleCount = PAGE_SIZE;
    render();
  }

  loadMore.addEventListener('click', function () {
    visibleCount = visibleProjects().length;
    render();
  });

  filters.addEventListener('click', function (event) {
    var button = event.target.closest('.project-filter');
    if (!button) {
      return;
    }
    activeTag = button.getAttribute('data-tag');
    renderFilters();
    resetPaging();
  });

  if (search) {
    search.addEventListener('input', function () {
      query = search.value.trim().toLowerCase();
      resetPaging();
    });
  }

  renderFilters();
  render();
})();
