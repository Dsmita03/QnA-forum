interface Props {
  index: number;
  content: string;
}

export default function AnswerItem({ index, content }: Props) {
  return (
    <div className="group relative border border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-white to-slate-50/50 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 ease-out">
      <div className="absolute top-0 left-6 w-12 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-b-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-center justify-between mb-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold">
            {index}
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            Answer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">
            #{String(index).padStart(2, '0')}
          </span>
          <div className="w-2 h-2 rounded-full bg-orange-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <div 
        className="text-slate-700 leading-relaxed text-[15px] answer-content prose prose-slate prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none rounded-b-2xl" />
    </div>
  );
}
