'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Video,
  Send,
  Copy,
  ExternalLink,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Bell,
  Users,
  Link as LinkIcon,
  Download,
  Upload,
  Settings,
  Zap
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  timezone: string;
  round2Status: string;
  interviewStatus: 'not_scheduled' | 'scheduled' | 'completed' | 'no_show' | 'rescheduled';
  scheduledTime?: string;
  zoomLink?: string;
  interviewNotes?: string;
  interviewRating?: number;
  interviewerId?: string;
}

interface ZoomMeeting {
  id: string;
  title: string;
  meetingId: string;
  passcode: string;
  joinUrl: string;
  startUrl: string;
  scheduledTime: string;
  duration: number;
  participantIds: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recordingUrl?: string;
}

interface ZoomSchedulerProps {
  competitionId: string;
  participants: Participant[];
  onScheduleUpdate?: (participantId: string, meetingData: any) => void;
}

const mockParticipants: Participant[] = [
  {
    id: 'p1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-0123',
    timezone: 'America/New_York',
    round2Status: 'approved',
    interviewStatus: 'not_scheduled'
  },
  {
    id: 'p2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0124',
    timezone: 'America/Los_Angeles',
    round2Status: 'approved',
    interviewStatus: 'scheduled',
    scheduledTime: '2024-02-25T14:00:00Z',
    zoomLink: 'https://zoom.us/j/123456789'
  },
  {
    id: 'p3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    timezone: 'Asia/Shanghai',
    round2Status: 'approved',
    interviewStatus: 'completed',
    scheduledTime: '2024-02-20T10:00:00Z',
    interviewRating: 4,
    interviewNotes: 'Strong technical skills, good communication.'
  }
];

const mockMeetings: ZoomMeeting[] = [
  {
    id: 'm1',
    title: 'Interview - Sarah Johnson',
    meetingId: '123456789',
    passcode: 'abc123',
    joinUrl: 'https://zoom.us/j/123456789?pwd=abc123',
    startUrl: 'https://zoom.us/s/123456789?zak=xyz789',
    scheduledTime: '2024-02-25T14:00:00Z',
    duration: 60,
    participantIds: ['p2'],
    status: 'scheduled'
  }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const timezones = [
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney'
];

export default function ZoomScheduler({ 
  competitionId, 
  participants = mockParticipants, 
  onScheduleUpdate 
}: ZoomSchedulerProps) {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>(mockMeetings);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [schedulingData, setSchedulingData] = useState({
    date: '',
    time: '',
    duration: 60,
    timezone: 'America/New_York',
    title: '',
    agenda: '',
    sendReminder: true,
    recordMeeting: true
  });
  const [activeTab, setActiveTab] = useState('schedule');
  const [zoomSettings, setZoomSettings] = useState({
    apiKey: '',
    apiSecret: '',
    defaultDuration: 60,
    autoRecord: true,
    waitingRoom: true,
    muteOnEntry: true
  });
  const [bulkScheduling, setBulkScheduling] = useState({
    startDate: '',
    endDate: '',
    timeSlots: [] as string[],
    duration: 60,
    breakBetween: 15
  });

  const handleScheduleInterview = () => {
    if (!selectedParticipant || !schedulingData.date || !schedulingData.time) return;

    const meetingDateTime = new Date(`${schedulingData.date}T${schedulingData.time}:00`);
    const newMeeting: ZoomMeeting = {
      id: Date.now().toString(),
      title: schedulingData.title || `Interview - ${selectedParticipant.name}`,
      meetingId: Math.random().toString().substr(2, 11),
      passcode: Math.random().toString(36).substr(2, 6),
      joinUrl: `https://zoom.us/j/${Math.random().toString().substr(2, 11)}`,
      startUrl: `https://zoom.us/s/${Math.random().toString().substr(2, 11)}`,
      scheduledTime: meetingDateTime.toISOString(),
      duration: schedulingData.duration,
      participantIds: [selectedParticipant.id],
      status: 'scheduled'
    };

    setMeetings(prev => [...prev, newMeeting]);
    onScheduleUpdate?.(selectedParticipant.id, {
      interviewStatus: 'scheduled',
      scheduledTime: meetingDateTime.toISOString(),
      zoomLink: newMeeting.joinUrl
    });

    // Reset form
    setSelectedParticipant(null);
    setSchedulingData({
      date: '',
      time: '',
      duration: 60,
      timezone: 'America/New_York',
      title: '',
      agenda: '',
      sendReminder: true,
      recordMeeting: true
    });
  };

  const handleSendNotification = (participant: Participant, meeting: ZoomMeeting) => {
    // Simulate sending notification
    console.log('Sending notification to:', participant.email);
  };

  const handleReschedule = (meetingId: string) => {
    setMeetings(prev => prev.map(m => 
      m.id === meetingId ? { ...m, status: 'cancelled' } : m
    ));
  };

  const handleCancelMeeting = (meetingId: string) => {
    setMeetings(prev => prev.map(m => 
      m.id === meetingId ? { ...m, status: 'cancelled' as const } : m
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-purple-100 text-purple-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const eligibleParticipants = participants.filter(p => p.round2Status === 'approved');
  const scheduledCount = participants.filter(p => p.interviewStatus === 'scheduled').length;
  const completedCount = participants.filter(p => p.interviewStatus === 'completed').length;
  const pendingCount = participants.filter(p => p.interviewStatus === 'not_scheduled').length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eligible</p>
                <p className="text-2xl font-bold text-gray-900">{eligibleParticipants.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule Interviews</TabsTrigger>
          <TabsTrigger value="meetings">Manage Meetings</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Scheduling</TabsTrigger>
          <TabsTrigger value="settings">Zoom Settings</TabsTrigger>
        </TabsList>

        {/* Schedule Interviews */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Participant Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Participant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eligibleParticipants.filter(p => p.interviewStatus === 'not_scheduled').map((participant) => (
                  <div 
                    key={participant.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedParticipant?.id === participant.id ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedParticipant(participant)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-600">{participant.email}</p>
                          <p className="text-xs text-gray-500">{participant.timezone}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(participant.interviewStatus)}>
                        {participant.interviewStatus.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Scheduling Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedParticipant ? `Schedule Interview: ${selectedParticipant.name}` : 'Select a Participant'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedParticipant ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <Input
                          type="date"
                          value={schedulingData.date}
                          onChange={(e) => setSchedulingData(prev => ({ ...prev, date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Time</label>
                        <Select value={schedulingData.time} onValueChange={(value) => setSchedulingData(prev => ({ ...prev, time: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                        <Select value={schedulingData.duration.toString()} onValueChange={(value) => setSchedulingData(prev => ({ ...prev, duration: parseInt(value) }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Timezone</label>
                        <Select value={schedulingData.timezone} onValueChange={(value) => setSchedulingData(prev => ({ ...prev, timezone: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timezones.map(tz => (
                              <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Meeting Title</label>
                      <Input
                        value={schedulingData.title}
                        onChange={(e) => setSchedulingData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={`Interview - ${selectedParticipant.name}`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Agenda</label>
                      <Textarea
                        value={schedulingData.agenda}
                        onChange={(e) => setSchedulingData(prev => ({ ...prev, agenda: e.target.value }))}
                        placeholder="Interview agenda and topics to cover..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Send Email Reminder</span>
                        <input
                          type="checkbox"
                          checked={schedulingData.sendReminder}
                          onChange={(e) => setSchedulingData(prev => ({ ...prev, sendReminder: e.target.checked }))}
                          className="h-4 w-4 text-orange-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Record Meeting</span>
                        <input
                          type="checkbox"
                          checked={schedulingData.recordMeeting}
                          onChange={(e) => setSchedulingData(prev => ({ ...prev, recordMeeting: e.target.checked }))}
                          className="h-4 w-4 text-orange-500"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleScheduleInterview}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      disabled={!schedulingData.date || !schedulingData.time}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Select a participant to schedule their interview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Manage Meetings */}
        <TabsContent value="meetings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings.map((meeting) => {
                  const participant = participants.find(p => p.id === meeting.participantIds[0]);
                  return (
                    <div key={meeting.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{meeting.title}</h3>
                          <p className="text-sm text-gray-600">{participant?.name} ({participant?.email})</p>
                          <p className="text-xs text-gray-500">
                            {new Date(meeting.scheduledTime).toLocaleString()} • {meeting.duration} minutes
                          </p>
                        </div>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-600 mb-1">Meeting ID</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-mono">{meeting.meetingId}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigator.clipboard.writeText(meeting.meetingId)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-600 mb-1">Passcode</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-mono">{meeting.passcode}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigator.clipboard.writeText(meeting.passcode)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(meeting.joinUrl, '_blank')}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(meeting.joinUrl)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </Button>
                        {participant && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNotification(participant, meeting)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Reminder
                          </Button>
                        )}
                        {meeting.status === 'scheduled' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReschedule(meeting.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelMeeting(meeting.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Scheduling */}
        <TabsContent value="bulk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Interview Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={bulkScheduling.startDate}
                    onChange={(e) => setBulkScheduling(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={bulkScheduling.endDate}
                    onChange={(e) => setBulkScheduling(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Available Time Slots</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <label key={time} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={bulkScheduling.timeSlots.includes(time)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkScheduling(prev => ({ ...prev, timeSlots: [...prev.timeSlots, time] }));
                          } else {
                            setBulkScheduling(prev => ({ ...prev, timeSlots: prev.timeSlots.filter(t => t !== time) }));
                          }
                        }}
                        className="h-4 w-4 text-orange-500"
                      />
                      <span className="text-sm">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Interview Duration (minutes)</label>
                  <Input
                    type="number"
                    value={bulkScheduling.duration}
                    onChange={(e) => setBulkScheduling(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    min="15"
                    max="180"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Break Between Interviews (minutes)</label>
                  <Input
                    type="number"
                    value={bulkScheduling.breakBetween}
                    onChange={(e) => setBulkScheduling(prev => ({ ...prev, breakBetween: parseInt(e.target.value) || 15 }))}
                    min="5"
                    max="60"
                  />
                </div>
              </div>
              
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                <Zap className="h-4 w-4 mr-2" />
                Generate Bulk Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zoom Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zoom Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">API Configuration</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Configure your Zoom API credentials to enable automatic meeting creation.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">API Key</label>
                    <Input
                      type="password"
                      value={zoomSettings.apiKey}
                      onChange={(e) => setZoomSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Your Zoom API Key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">API Secret</label>
                    <Input
                      type="password"
                      value={zoomSettings.apiSecret}
                      onChange={(e) => setZoomSettings(prev => ({ ...prev, apiSecret: e.target.value }))}
                      placeholder="Your Zoom API Secret"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Default Meeting Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Default Duration (minutes)</label>
                  <Input
                    type="number"
                    value={zoomSettings.defaultDuration}
                    onChange={(e) => setZoomSettings(prev => ({ ...prev, defaultDuration: parseInt(e.target.value) || 60 }))}
                    min="15"
                    max="180"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto Record Meetings</span>
                    <input
                      type="checkbox"
                      checked={zoomSettings.autoRecord}
                      onChange={(e) => setZoomSettings(prev => ({ ...prev, autoRecord: e.target.checked }))}
                      className="h-4 w-4 text-orange-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Enable Waiting Room</span>
                    <input
                      type="checkbox"
                      checked={zoomSettings.waitingRoom}
                      onChange={(e) => setZoomSettings(prev => ({ ...prev, waitingRoom: e.target.checked }))}
                      className="h-4 w-4 text-orange-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mute Participants on Entry</span>
                    <input
                      type="checkbox"
                      checked={zoomSettings.muteOnEntry}
                      onChange={(e) => setZoomSettings(prev => ({ ...prev, muteOnEntry: e.target.checked }))}
                      className="h-4 w-4 text-orange-500"
                    />
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}