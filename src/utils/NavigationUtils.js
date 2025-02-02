import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

// This initializes a navigation reference
export const navigationRef = createNavigationContainerRef();

// The navigate function uses this reference to navigate
// The navigate function uses this reference to navigate
export function navigate(routeName, params) {
  console.log(`Navigating to: ${routeName}`); // Log the navigation
  if (navigationRef.isReady()) {
    console.log('Navigation is ready. Navigating...'); // Log when navigation is ready
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
  } else {
    console.log('Navigation is not ready yet'); // Log if navigation is not ready
  }
}

export function replace(routeName, params) {
  if (navigationRef.isReady()) {
    console.log('Navigation is ready. Replacing screen...');
    navigationRef.dispatch(CommonActions.replace(routeName, params));
  } else {
    console.log('Navigation is not ready yet');
  }
}

export function resetAndNavigate(routeName) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name: routeName }] }));
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
  }
}

export function push(routeName, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.push(routeName, params));
  }
}
