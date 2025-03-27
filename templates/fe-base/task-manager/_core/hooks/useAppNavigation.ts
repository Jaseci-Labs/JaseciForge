import {
  useNavigation,
  useNavigationState,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';

type UseAppNavigationReturn = {
  navigate: (route: string, params?: object) => void;
  addListener: (event: string, callback: (e: any) => void) => void;
  current_route: any;
  goBack: () => void;
  native_navigation: NavigationProp<ParamListBase>;
};

const useAppNavigation = (
  navState?: (state: any) => any,
): UseAppNavigationReturn => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const defaultSelector = (state: any) => state;
  const current_route = useNavigationState(navState || defaultSelector);

  const navigate = (route: string, params?: object) => {
    navigation.navigate(route, params);
  };

  const goBack = () => {
    navigation.goBack();
  };
  const addListener = (event: any, callback: any) => {
    return navigation.addListener(event, callback);
  };

  return {
    navigate,
    addListener,
    current_route,
    goBack,
    native_navigation: navigation,
  };
};

export default useAppNavigation;
