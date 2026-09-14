import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  Activity,
  GraduationCap,
  Layers,
} from 'lucide-react';

export default function CategoryIcon({ iconName, className = 'h-4 w-4' }) {
  switch (iconName) {
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    default:
      return <Layers className={className} />;
  }
}
