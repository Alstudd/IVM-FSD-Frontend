import {
  Component,
  OnInit,
  HostListener,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit {
  // UI state variables
  isLoading: boolean = false;
  isScrolled: boolean = false;
  hasAccess: boolean = true; // This would normally be determined by authentication

  // Animation control for various sections
  isFeatureVisible: boolean[] = [];
  isStepVisible: boolean[] = [];
  isStatVisible: boolean[] = [];

  // Feature cards data with Lucide icon names
  features = [
    {
      icon: '📋',
      title: 'Request Management',
      description:
        'Easily submit and track item requests for your department or organization.',
    },
    {
      icon: '📦',
      title: 'Inventory Tracking',
      description:
        'Real-time tracking of all inventory items with detailed information.',
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description:
        'Visual representation of inventory data for better decision making.',
    },
    {
      icon: '👤',
      title: 'Role-Based Access',
      description:
        'Secure system with controlled access based on user roles and permissions.',
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description:
        'Stay updated with real-time notifications about request status changes.',
    },
    {
      icon: '⛬',
      title: 'Activity History',
      description:
        'Keep track of all activities with a comprehensive audit trail.',
    },
  ];

  // Workflow steps with Lucide icon names
  workflowSteps = [
    {
      icon: '🌐',
      title: 'Login to the System',
      description:
        'Securely log in to the system with your college credentials.',
    },
    {
      icon: '📝',
      title: 'Submit a Request',
      description: 'Fill out the item request form with all required details.',
    },
    {
      icon: '✅',
      title: 'Get Approval',
      description:
        'Wait for your request to be approved by the authorized personnel.',
    },
    {
      icon: '📦',
      title: 'Collect Items',
      description: 'Collect the approved items from the inventory store.',
    },
    {
      icon: '⏎',
      title: 'Return Items',
      description: 'Return the items after use to maintain inventory accuracy.',
    },
  ];

  // Stats data with Lucide icon names
  stats = [
    {
      icon: '📦',
      value: '1,200+',
      label: 'Inventory Items',
    },
    {
      icon: '👤',
      value: '500+',
      label: 'Active Users',
    },
    {
      icon: '✅',
      value: '2,000+',
      label: 'Requests Fulfilled',
    },
    {
      icon: '🎯',
      value: '98%',
      label: 'Uptime',
    },
  ];

  constructor(private router: Router) {
    // Initialize visibility arrays for animations
    this.isFeatureVisible = new Array(this.features.length).fill(false);
    this.isStepVisible = new Array(this.workflowSteps.length).fill(false);
    this.isStatVisible = new Array(this.stats.length).fill(false);
  }

  ngOnInit(): void {
    // Add Intersection Observer for animated elements
    this.setupIntersectionObservers();
  }

  // Listen for scroll events
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isScrolled = scrollPosition > 50;
  }

  // Scroll to features section
  scrollToFeatures() {
    const featuresElement = document.getElementById('features-section');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Navigation function
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  // Setup Intersection Observer for animations
  setupIntersectionObservers() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    // Observer for feature cards
    this.createObserver('.feature-card', this.isFeatureVisible, options);

    // Observer for workflow steps
    this.createObserver('.workflow-step', this.isStepVisible, options);

    // Observer for stats
    this.createObserver('.stat-card', this.isStatVisible, options);
  }

  // Helper function to create observers
  createObserver(
    selector: string,
    visibilityArray: boolean[],
    options: IntersectionObserverInit
  ) {
    setTimeout(() => {
      const elements = document.querySelectorAll(selector);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute('data-index') || '0'
            );
            setTimeout(() => {
              visibilityArray[index] = true;
            }, index * 100); // Staggered animation
            observer.unobserve(entry.target);
          }
        });
      }, options);

      elements.forEach((element, index) => {
        element.setAttribute('data-index', index.toString());
        observer.observe(element);
      });
    }, 100);
  }
}
