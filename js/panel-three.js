/* "How We Work" panel: a quiet constellation of points that tilts toward the
   cursor. Pure decoration — skipped entirely if WebGL or motion isn't available,
   so the panel still looks correct (solid navy) without it. */
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.querySelector('[data-panel-canvas]');
  var panel = canvas && canvas.closest('.panel');
  if (!canvas || !panel || reduceMotion) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (e) {
    return; // no WebGL: leave the plain navy panel as-is
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 6;

  var group = new THREE.Group();
  scene.add(group);

  /* scatter points in a loose volume in front of the camera */
  var COUNT = 90;
  var positions = new Float32Array(COUNT * 3);
  for (var i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  var pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var pointsMat = new THREE.PointsMaterial({
    color: 0xf3e3b8, size: 0.05, sizeAttenuation: true,
    transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending
  });
  group.add(new THREE.Points(pointsGeo, pointsMat));

  /* faint constellation lines between nearby points, built once */
  var linePositions = [];
  var MAX_DIST = 2.1;
  for (var a = 0; a < COUNT; a++) {
    for (var b = a + 1; b < COUNT; b++) {
      var dx = positions[a * 3] - positions[b * 3];
      var dy = positions[a * 3 + 1] - positions[b * 3 + 1];
      var dz = positions[a * 3 + 2] - positions[b * 3 + 2];
      var d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < MAX_DIST) {
        linePositions.push(
          positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
          positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]
        );
      }
    }
  }
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  var lineMat = new THREE.LineBasicMaterial({ color: 0x7a7fd6, transparent: true, opacity: 0.22 });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  var target = { x: 0, y: 0 };
  var current = { x: 0, y: 0 };
  var idle = 0;

  window.addEventListener('mousemove', function (e) {
    var rect = panel.getBoundingClientRect();
    var nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    var ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    target.x = Math.max(-1, Math.min(1, nx));
    target.y = Math.max(-1, Math.min(1, ny));
  }, { passive: true });

  var resize = function () {
    var w = panel.clientWidth, h = panel.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(panel);
  } else {
    window.addEventListener('resize', resize, { passive: true });
  }

  var isVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.01 }).observe(panel);
  }

  var rafId;
  var tick = function () {
    rafId = requestAnimationFrame(tick);
    if (!isVisible) return;
    idle += 0.0025;
    current.x += (target.x - current.x) * 0.05;
    current.y += (target.y - current.y) * 0.05;
    group.rotation.y = current.x * 0.28 + Math.sin(idle) * 0.04;
    group.rotation.x = -current.y * 0.18;
    group.position.x = current.x * 0.25;
    renderer.render(scene, camera);
  };
  tick();
})();
