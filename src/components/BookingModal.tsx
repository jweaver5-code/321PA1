'use client';

import { useState, useEffect } from 'react';
import { Tutor } from '@/types';

interface BookingModalProps {
  tutor: Tutor;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingDetails: any) => void;
}

export default function BookingModal(props: BookingModalProps) {
  console.log('BookingModal: RAW props received:', props);
  console.log('BookingModal: props keys:', Object.keys(props));
  console.log('BookingModal: props.onConfirm directly:', props.onConfirm);
  
  const { tutor, isOpen, onClose, onConfirm } = props;
  
  // Debug logging for props - with more detail
  useEffect(() => {
    console.log('BookingModal useEffect - Props check:', {
      props,
      tutor: tutor?.name,
      isOpen,
      onClose: typeof onClose,
      onConfirm: typeof onConfirm,
      onConfirmValue: onConfirm,
      onConfirmString: String(onConfirm)
    });
  }, [props, tutor, isOpen, onClose, onConfirm]);

  console.log('BookingModal: Component created with props:', { 
    props,
    tutorName: tutor.name, 
    isOpen, 
    onClose: typeof onClose, 
    onConfirm: typeof onConfirm,
    onConfirmExists: !!onConfirm,
    onConfirmActualValue: onConfirm,
    allProps: { tutor: tutor?.name, isOpen, onClose, onConfirm }
  });
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [subject, setSubject] = useState(tutor.subjects[0] || '');
  const [sessionType, setSessionType] = useState<'in-person' | 'online'>('online');
  const [specialRequests, setSpecialRequests] = useState('');
  const [step, setStep] = useState(1);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const availableSlots = timeSlots.filter(() => Math.random() > 0.3); // Simulate availability

  const totalCost = tutor.hourlyRate * duration;
  const serviceFee = Math.round(totalCost * 0.1);
  const finalCost = totalCost + serviceFee;

  const handleBooking = () => {
    console.log('BookingModal: handleBooking called, step:', step);
    
    if (step < 3) {
      console.log('BookingModal: Moving to next step');
      setStep(step + 1);
    } else {
      console.log('BookingModal: Creating booking details...');
      const bookingDetails = {
        tutorId: tutor.id,
        date: selectedDate,
        time: selectedTime,
        duration,
        subject,
        sessionType,
        specialRequests,
        totalCost: finalCost
      };
      console.log('BookingModal: Calling onConfirm with:', bookingDetails);
      console.log('BookingModal: onConfirm function:', onConfirm);
      console.log('BookingModal: onConfirm type:', typeof onConfirm);
      console.log('BookingModal: props.onConfirm type:', typeof props.onConfirm);
      console.log('BookingModal: props.onConfirm value:', props.onConfirm);
      
      // Try using props.onConfirm directly instead of destructured version
      if (typeof props.onConfirm === 'function') {
        props.onConfirm(bookingDetails);
      } else if (typeof onConfirm === 'function') {
        onConfirm(bookingDetails);
      } else {
        console.error('Neither onConfirm nor props.onConfirm is a function:', {
          onConfirm,
          propsOnConfirm: props.onConfirm,
          onConfirmType: typeof onConfirm,
          propsOnConfirmType: typeof props.onConfirm
        });
        alert('Booking error: onConfirm callback is not properly set');
      }
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedDate && selectedTime && subject;
      case 2:
        return duration > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book a Session</h2>
              <p className="text-gray-600 mt-1">with {tutor.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Date & Time</span>
            <span>Duration & Type</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Date & Time</h3>
                
                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Time Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {tutor.subjects.map((subj) => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Session Details</h3>
              
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <div className="flex items-center space-x-4">
                  {[0.5, 1, 1.5, 2, 2.5, 3].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setDuration(hours)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                        duration === hours
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Type
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSessionType('online')}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                      sessionType === 'online'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium">Online</p>
                      <p className="text-xs opacity-75">Video call session</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setSessionType('in-person')}
                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                      sessionType === 'in-person'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="font-medium">In-Person</p>
                      <p className="text-xs opacity-75">Meet in person</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any specific topics or requirements for this session..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              {/* Tutor Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {tutor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{tutor.name}</h4>
                    <p className="text-sm text-gray-600">{tutor.major} • {tutor.university}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Subject:</span>
                    <p className="font-medium">{subject}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{duration} hour{duration !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium capitalize">{sessionType}</p>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Cost Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tutoring ({duration} hour{duration !== 1 ? 's' : ''} @ ${tutor.hourlyRate}/hr)</span>
                    <span>${totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${finalCost}</span>
                  </div>
                </div>
              </div>

              {specialRequests && (
                <div>
                  <h4 className="font-semibold mb-2">Special Requests</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {specialRequests}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log('BookingModal: Book button clicked!');
                console.log('BookingModal: canProceed():', canProceed());
                console.log('BookingModal: step:', step);
                handleBooking();
              }}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {step < 3 ? 'Next' : `Book Session - $${finalCost}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
