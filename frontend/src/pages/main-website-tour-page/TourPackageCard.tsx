import React from 'react';
import { Flame, Heart, Star, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { formatINR } from '../../data/paidTourContent';

interface TourPackageCardProps {
  pkg: any;
  liked?: boolean;
  onToggleLike?: (id: string, e: React.MouseEvent) => void;
  onClick?: () => void;
}

export const TourPackageCard: React.FC<TourPackageCardProps> = ({
  pkg,
  liked = false,
  onToggleLike,
  onClick,
}) => {
  return (
    <div
      className="group bg-white rounded-[1.75rem] overflow-hidden shadow-lg border border-orange-100/40 card-lift cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-64 overflow-hidden img-zoom">
        <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>
        {pkg.featured && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-brand to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10">
            <Flame className="w-3 h-3" /> Featured
          </span>
        )}
        <span className="absolute top-4 right-14 glass-white text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow z-10">
          {pkg.type}
        </span>
        {onToggleLike && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(pkg.id, e);
            }}
            className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 transition-all cursor-pointer ${
              liked ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-600 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        )}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-14 bg-white rounded-t-full flex items-end justify-center pb-3 z-10 shadow-lg">
          <div className="flex gap-px text-brand">
            {[...Array(5)].map((_, j) => (
              <Star key={j} className="w-3 h-3 fill-current" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-3 right-4 z-10">
          <span className="glass-white text-slate-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 fill-current" />
            {pkg.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <div className="flex items-center gap-1.5 text-brand text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{pkg.location}</span>
        </div>
        <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-brand transition-colors leading-snug">
          {pkg.name}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{pkg.desc}</p>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {pkg.durationText}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {pkg.groupText}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            {pkg.reviews.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-orange-100/50">
          <div>
            <span className="text-xs text-slate-400">From</span>
            <p className="font-serif text-2xl font-bold text-slate-900">{formatINR(pkg.price)}</p>
            <span className="text-[10px] text-slate-400">per person</span>
          </div>
          <button className="px-5 py-2.5 rounded-full bg-brand hover:bg-brand-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand/20 flex items-center gap-1.5 group-hover:gap-2.5 cursor-pointer">
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
