import { Tutor } from '@/types';

interface TutorCardProps {
  tutor: Tutor;
  onBook: () => void;
}

export default function TutorCard({ tutor, onBook }: TutorCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
      {/* Header with Avatar and Status */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {tutor.name.charAt(0)}
              </div>
              {/* Online Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            
            {/* Name and Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {tutor.name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span className="truncate">{tutor.major}</span>
                <span className="mx-2">•</span>
                <span>{tutor.year}</span>
              </div>
              {tutor.university && (
                <p className="text-xs text-gray-500 mt-1 truncate">{tutor.university}</p>
              )}
            </div>
          </div>
          
          {/* Verification Badge */}
          {tutor.isVerified && (
            <div className="flex-shrink-0">
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating and Availability */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Rating */}
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(tutor.rating)
                        ? 'text-yellow-400'
                        : i === Math.floor(tutor.rating) && tutor.rating % 1 !== 0
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">{tutor.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({tutor.reviews})</span>
            </div>
          </div>
          
          {/* Availability Status */}
          <div className="flex items-center">
            <div className="flex items-center text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-600 font-medium">{tutor.availability}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-6 pb-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {tutor.bio}
        </p>
      </div>

      {/* Subjects Tags */}
      <div className="px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {tutor.subjects.slice(0, 3).map((subject, index) => (
            <span
              key={subject}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                index === 0
                  ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200'
                  : index === 1
                  ? 'bg-purple-100 text-purple-800 group-hover:bg-purple-200'
                  : 'bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200'
              }`}
            >
              {subject}
            </span>
          ))}
          {tutor.subjects.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
              +{tutor.subjects.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer with Price and Actions */}
      <div className="bg-gray-50 px-6 py-4 group-hover:bg-gray-100 transition-colors">
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">${tutor.hourlyRate}</span>
            <span className="text-sm text-gray-500 ml-1">/hour</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button 
              onClick={onBook}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
