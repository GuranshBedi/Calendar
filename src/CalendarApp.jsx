import { useState, useEffect } from 'react';
import { Calendar, Plus, List, Grid, Sun, Moon, Clock, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    location: ''
  });

  useEffect(() => {
    document.title = 'My Calendar App';
    const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.type = 'image/svg+xml';
    favicon.rel = 'icon';
    favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📅</text></svg>";
    document.head.appendChild(favicon);

    const themeColor = document.querySelector("meta[name='theme-color']") || document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#2563eb';
    document.head.appendChild(themeColor);
  }, []);

  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem('calendarEvents');
      const savedTheme = localStorage.getItem('calendarTheme');
      const savedViewMode = localStorage.getItem('calendarViewMode');
      
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
      if (savedViewMode) {
        setViewMode(savedViewMode);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    } catch (e) {
      console.error('Error saving events:', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('calendarTheme', JSON.stringify(isDarkMode));
    } 
    catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('calendarViewMode', viewMode);
    } catch (e) {
      console.error('Error saving view mode to localStorage:', e);
    }
  }, [viewMode]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDateForComparison = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) 
    return [];
    const dateStr = formatDateForComparison(date);
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowEventDetails(true);
  };

  const handleCreateEvent = () => {
    const newEvent = {
      id: Date.now(),
      ...eventForm,
      createdAt: new Date().toISOString()
    };
    setEvents([...events, newEvent]);
    setEventForm({
      title: '',
      date: '',
      time: '',
      description: '',
      location: ''
    });
    setShowEventModal(false);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setShowEventDetails(false);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const openCreateEventModal = (selectedDate = null) => {
    let dateStr = '';
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }
    setEventForm({
      title: '',
      date: dateStr,
      time: '',
      description: '',
      location: ''
    });
    setShowEventModal(true);
    setShowEventDetails(false);
  };

  const getDatesForListView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push(date);
    }
    return dates;
  };

  const themeClasses = isDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-white text-gray-900';

  const cardClasses = isDarkMode
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const inputClasses = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-200`}>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Calendar</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-colors ${
                isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <div className={`flex rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => openCreateEventModal()}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className={`p-2 rounded-lg border transition-colors ${
              isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-2xl font-semibold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth(1)}
            className={`p-2 rounded-lg border transition-colors ${
              isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        {viewMode === 'grid' ? (
          <div className={`rounded-lg border ${cardClasses} overflow-hidden`}>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7">
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  className={`p-4 text-center font-semibold border-b ${
                    isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {getDaysInMonth(currentDate).map((date, index) => (
                <div
                  key={index}
                  className={`min-h-[80px] p-1 border-b border-r cursor-pointer transition-colors ${
                    isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'
                  } ${!date ? 'cursor-default' : ''}`}
                  onClick={() => date && handleDateClick(date)}
                >
                  {date && (
                    <>
                      <div className="font-medium text-sm mb-1">{date.getDate()}</div>
                      <div className="space-y-1">
                        {getEventsForDate(date).slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate text-[10px] ${
                              isDarkMode 
                                ? 'bg-blue-800 text-blue-200' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {event.time && `${formatTime(event.time)} `}{event.title}
                          </div>
                        ))}
                        {getEventsForDate(date).length > 2 && (
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            +{getEventsForDate(date).length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`rounded-lg border ${cardClasses}`}>
            <div className="divide-y divide-gray-200">
              {getDatesForListView().map(date => {
                const dayEvents = getEventsForDate(date);
                return (
                  <div
                    key={date.toISOString()}
                    className={`p-3 cursor-pointer transition-colors ${
                      isDarkMode ? 'hover:bg-gray-750 divide-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-right w-12">
                        <div className="font-medium text-sm">{date.getDate()}</div>
                        <div className="text-xs text-gray-500">
                          {daysOfWeek[date.getDay()]}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        {dayEvents.length > 0 ? (
                          <div className="space-y-1">
                            {dayEvents.map(event => (
                              <div
                                key={event.id}
                                className={`flex items-center space-x-2 p-2 rounded-lg ${
                                  isDarkMode 
                                    ? 'bg-blue-900 text-blue-100' 
                                    : 'bg-blue-50 text-blue-900'
                                }`}
                              >
                                {event.time && (
                                  <Clock className={`h-3 w-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {event.time && `${formatTime(event.time)} - `}{event.title}
                                  </div>
                                  {event.location && (
                                    <div className={`text-xs flex items-center space-x-1 ${
                                      isDarkMode ? 'text-blue-300' : 'text-blue-700'
                                    }`}>
                                      <MapPin className="h-3 w-3" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-sm">No events</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {showEventModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className={`${cardClasses} rounded-lg p-6 w-full max-w-md border shadow-2xl`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create Event</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className={`w-full p-3 border rounded-lg ${inputClasses}`}
                />
                
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                  className={`w-full p-3 border rounded-lg ${inputClasses}`}
                />
                
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                  className={`w-full p-3 border rounded-lg ${inputClasses}`}
                />
                
                <input
                  type="text"
                  placeholder="Location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  className={`w-full p-3 border rounded-lg ${inputClasses}`}
                />
                
                <textarea
                  placeholder="Description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className={`w-full p-3 border rounded-lg h-24 resize-none ${inputClasses}`}
                />
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className={`flex-1 p-3 border rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 hover:bg-gray-700' 
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateEvent}
                    disabled={!eventForm.title || !eventForm.date}
                    className="flex-1 p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showEventDetails && selectedDate && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className={`${cardClasses} rounded-lg p-6 w-full max-w-md border shadow-2xl`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Events for {formatDateForDisplay(selectedDate)}
                </h3>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {getEventsForDate(selectedDate).map(event => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {event.time && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.time)}</span>
                      </div>
                    )}
                    
                    {event.location && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    )}
                  </div>
                ))}
                
                {getEventsForDate(selectedDate).length === 0 && (
                  <p className="text-center text-gray-500 py-8">No events for this date</p>
                )}
              </div>
              
              <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <button
                  onClick={() => openCreateEventModal(selectedDate)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event for {formatDateForDisplay(selectedDate)}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CalendarApp;