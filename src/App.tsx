/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

// --- TYPES & INTERFACES ---
interface StudentData {
  name: string;
  attendance: number;
  marks: number;
  assignmentMarks: number;
}

type Role = 'Teacher' | 'Student';
type View = 'Login' | 'TeacherDash' | 'StudentDash';

// --- CONSTANTS & MOCK DATA ---
const INITIAL_STUDENTS: StudentData[] = [];

export default function App() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState<View>('Login');
  const [role, setRole] = useState<Role>('Teacher');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [students, setStudents] = useState<StudentData[]>(INITIAL_STUDENTS);
  const [passingMarks, setPassingMarks] = useState(40); // Global passing marks
  const [passingAttendance, setPassingAttendance] = useState(75); // Global passing attendance
  const [passingAssignment, setPassingAssignment] = useState(40); // Global passing assignment marks
  
  // State for "Predict Performance" form
  const [predAttendance, setPredAttendance] = useState(0);
  const [predMarks, setPredMarks] = useState(0);
  const [predAssignment, setPredAssignment] = useState(0);
  const [predictionResult, setPredictionResult] = useState<{ score: number; status: string; category: string } | null>(null);

  // State for Teacher Dashboard active section
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // State for "Add/Edit Student" form
  const [newName, setNewName] = useState('');
  const [newAttendance, setNewAttendance] = useState(0);
  const [newMarks, setNewMarks] = useState(0);
  const [newAssignment, setNewAssignment] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // --- LOGIC: AI PREDICTION FORMULA ---
  // Simple weighted calculation to simulate AI behavior
  const calculatePrediction = (attendance: number, marks: number, assignment: number) => {
    // Weights: Attendance 20%, Marks 50%, Assignment 30%
    const score = (attendance * 0.2) + (marks * 0.5) + (assignment * 0.3);
    
    // Pass only if all thresholds are met
    const status = (
      score >= passingMarks && 
      attendance >= passingAttendance && 
      assignment >= passingAssignment
    ) ? "Pass" : "Fail";
    
    // AI Category Separation
    let category = "Average";
    if (score >= 75 && attendance >= 85) category = "Good";
    else if (score < passingMarks || attendance < passingAttendance || assignment < passingAssignment) category = "Weak";
    
    return { score: Math.round(score), status, category };
  };

  // --- VIEW HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'Teacher') setView('TeacherDash');
    else setView('StudentDash');
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculatePrediction(predAttendance, predMarks, predAssignment);
    setPredictionResult(result);
  };

  const handleAddOrEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const studentData: StudentData = {
      name: newName,
      attendance: newAttendance,
      marks: newMarks,
      assignmentMarks: newAssignment,
    };

    if (editingIndex !== null) {
      const updatedStudents = [...students];
      updatedStudents[editingIndex] = studentData;
      setStudents(updatedStudents);
      setEditingIndex(null);
    } else {
      setStudents([...students, studentData]);
    }

    // Reset form
    setNewName('');
    setNewAttendance(0);
    setNewMarks(0);
    setNewAssignment(0);
    setActiveSection('monitor'); // Redirect to monitoring
  };

  const startEditing = (index: number) => {
    const s = students[index];
    setNewName(s.name);
    setNewAttendance(s.attendance);
    setNewMarks(s.marks);
    setNewAssignment(s.assignmentMarks);
    setEditingIndex(index);
    setActiveSection('add'); // Use 'add' section for editing too
  };

  // --- COMPONENTS ---

  // 1. LOGIN PAGE
  if (view === 'Login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
          <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">AI Student Monitor</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input 
                type="text" required 
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input 
                type="text" required 
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={department} onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select 
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                value={role} onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. TEACHER DASHBOARD
  if (view === 'TeacherDash') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Pass Marks:</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    className="w-12 border rounded p-1 text-center font-bold text-sm"
                    value={passingMarks} 
                    onChange={(e) => setPassingMarks(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Pass Attnd%:</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    className="w-12 border rounded p-1 text-center font-bold text-sm"
                    value={passingAttendance} 
                    onChange={(e) => setPassingAttendance(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Pass Asgn:</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    className="w-12 border rounded p-1 text-center font-bold text-sm"
                    value={passingAssignment} 
                    onChange={(e) => setPassingAssignment(Number(e.target.value))}
                  />
                </div>
              </div>
              <button onClick={() => setView('Login')} className="text-sm text-red-600 hover:underline">Logout</button>
            </div>
          </div>

          {/* Main Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { id: 'predict', label: 'Predict Student Performance', icon: '📊' },
              { id: 'weak', label: 'Identify Weak Students', icon: '⚠️' },
              { id: 'insights', label: 'Useful Insights', icon: '💡' },
              { id: 'monitor', label: 'Academic Monitoring', icon: '📋' },
              { id: 'add', label: 'Add New Student', icon: '➕' }
            ].map((opt) => (
              <button 
                key={opt.id}
                onClick={() => setActiveSection(opt.id)}
                className={`p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-left hover:border-blue-500 transition ${activeSection === opt.id ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <span className="text-2xl mb-2 block">{opt.icon}</span>
                <span className="font-semibold text-gray-700">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Section Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {!activeSection && <p className="text-gray-500 text-center">Select an option above to view details.</p>}
            
            {activeSection === 'predict' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Predict Performance</h2>
                <form onSubmit={handlePredict} className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-sm">Attendance (%)</label>
                    <input type="number" min="0" max="100" required className="w-full border p-2 rounded" value={predAttendance} onChange={(e) => setPredAttendance(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm">Current Marks</label>
                    <input type="number" min="0" max="100" required className="w-full border p-2 rounded" value={predMarks} onChange={(e) => setPredMarks(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm">Assignment Marks</label>
                    <input type="number" min="0" max="100" required className="w-full border p-2 rounded" value={predAssignment} onChange={(e) => setPredAssignment(Number(e.target.value))} />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Predict Now</button>
                </form>
                {predictionResult && (
                  <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
                    <p className="font-bold">Predicted Score: {predictionResult.score}</p>
                    <p className={`font-bold ${predictionResult.status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                      Result: {predictionResult.status}
                    </p>
                    <p className="text-sm mt-1">
                      AI Category: <span className={`font-bold ${predictionResult.category === 'Good' ? 'text-green-600' : predictionResult.category === 'Weak' ? 'text-red-600' : 'text-blue-600'}`}>
                        {predictionResult.category}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      * Pass requires score ≥ {passingMarks}, attendance ≥ {passingAttendance}%, and assignment ≥ {passingAssignment}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'weak' && (
              <div>
                <h2 className="text-xl font-bold mb-4">AI Student Separation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-green-600 mb-2">Good Students (High Performers)</h3>
                    <ul className="space-y-2">
                      {students.map((s, idx) => {
                        const pred = calculatePrediction(s.attendance, s.marks, s.assignmentMarks);
                        if (pred.category !== 'Good') return null;
                        return (
                          <li key={idx} className="p-3 bg-green-50 border border-green-200 rounded flex justify-between">
                            <span>{s.name}</span>
                            <span className="text-xs font-bold text-green-600">GOOD</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-600 mb-2">Weak Students (At Risk)</h3>
                    <ul className="space-y-2">
                      {students.map((s, idx) => {
                        const pred = calculatePrediction(s.attendance, s.marks, s.assignmentMarks);
                        if (pred.category !== 'Weak') return null;
                        return (
                          <li key={idx} className="p-3 bg-red-50 border border-red-200 rounded flex justify-between">
                            <span>{s.name}</span>
                            <span className="text-xs font-bold text-red-600">WEAK</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'insights' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Useful Insights</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>Passing Threshold:</strong> Students below {passingMarks} marks are currently considered at risk.</li>
                  <li><strong>Attendance Rule:</strong> Attendance below {passingAttendance}% results in automatic failure regardless of marks.</li>
                  <li><strong>Assignment Rule:</strong> Assignment marks below {passingAssignment} results in automatic failure.</li>
                  <li><strong>High Performers:</strong> Students with score ≥ 75 and attendance ≥ 85% are categorized as "Good".</li>
                  <li><strong>Assignment Correlation:</strong> High assignment scores strongly predict final success.</li>
                  <li><strong>Early Warning:</strong> Low internal marks in the first month indicate a need for intervention.</li>
                </ul>
              </div>
            )}

            {activeSection === 'monitor' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Academic Monitoring</h2>
                {students.length === 0 ? (
                  <p className="text-gray-500 italic">No students added yet. Use "Add New Student" to begin.</p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Student Name</th>
                        <th className="p-2 border">Attendance</th>
                        <th className="p-2 border">Marks</th>
                        <th className="p-2 border">Assignments</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, idx) => {
                        const pred = calculatePrediction(s.attendance, s.marks, s.assignmentMarks);
                        return (
                          <tr key={idx}>
                            <td className="p-2 border">{s.name}</td>
                            <td className="p-2 border">{s.attendance}%</td>
                            <td className="p-2 border">{s.marks}</td>
                            <td className="p-2 border">{s.assignmentMarks}</td>
                            <td className={`p-2 border font-bold ${pred.status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                              {pred.status}
                            </td>
                            <td className={`p-2 border font-bold ${pred.category === 'Good' ? 'text-green-600' : pred.category === 'Weak' ? 'text-red-600' : 'text-blue-600'}`}>
                              {pred.category}
                            </td>
                            <td className="p-2 border">
                              <button 
                                onClick={() => startEditing(idx)}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeSection === 'add' && (
              <div>
                <h2 className="text-xl font-bold mb-4">{editingIndex !== null ? 'Edit Student' : 'Add New Student'}</h2>
                <form onSubmit={handleAddOrEditStudent} className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-sm">Full Name</label>
                    <input type="text" required className="w-full border p-2 rounded" value={newName} onChange={(e) => setNewName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm">Attendance (%)</label>
                    <input type="number" min="0" max="100" required className="w-full border p-2 rounded" value={newAttendance} onChange={(e) => setNewAttendance(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm">Current Marks</label>
                    <input type="number" min="0" max="100" required className="w-full border p-2 rounded" value={newMarks} onChange={(e) => setNewMarks(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm">Assignment Marks</label>
                    <input type="number" min="0" max="100" required className="w-full border p-2 rounded" value={newAssignment} onChange={(e) => setNewAssignment(Number(e.target.value))} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                      {editingIndex !== null ? 'Update Student' : 'Add Student'}
                    </button>
                    {editingIndex !== null && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingIndex(null);
                          setNewName('');
                          setNewAttendance(0);
                          setNewMarks(0);
                          setNewAssignment(0);
                          setActiveSection('monitor');
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. STUDENT DASHBOARD
  if (view === 'StudentDash') {
    // Try to find the student by name (username entered at login)
    const myData = students.find(s => s.name.toLowerCase() === username.toLowerCase());
    const prediction = myData ? calculatePrediction(myData.attendance, myData.marks, myData.assignmentMarks) : null;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
            <button onClick={() => setView('Login')} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
          
          {!myData ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">Student record not found for "{username}".</p>
              <p className="text-sm text-gray-400">Please ensure the teacher has added your name correctly.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500 uppercase font-bold">Student Name</p>
                <p className="text-lg font-semibold">{myData.name}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                  <p className="text-xs text-blue-600 uppercase font-bold">Attendance</p>
                  <p className="text-xl font-bold">{myData.attendance}%</p>
                </div>
                <div className="bg-green-50 p-4 rounded border border-green-100">
                  <p className="text-xs text-green-600 uppercase font-bold">Marks</p>
                  <p className="text-xl font-bold">{myData.marks}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded border border-purple-100">
                  <p className="text-xs text-purple-600 uppercase font-bold">Assignments</p>
                  <p className="text-xl font-bold">{myData.assignmentMarks}</p>
                </div>
              </div>

              {prediction && (
                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
                  <h2 className="text-sm font-bold text-gray-600 uppercase mb-4">AI Predicted Performance</h2>
                  <p className="text-lg mb-2">Your predicted score is <span className="font-bold text-blue-600">{prediction.score}</span></p>
                  <p className="text-md mb-2">
                    Status: <span className={`font-bold ${prediction.status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                      {prediction.status}
                    </span>
                  </p>
                  <p className="text-md mb-2">
                    AI Category: <span className={`font-bold ${prediction.category === 'Good' ? 'text-green-600' : prediction.category === 'Weak' ? 'text-red-600' : 'text-blue-600'}`}>
                      {prediction.category}
                    </span>
                  </p>
                  {prediction.status === 'Fail' && (
                    <p className="text-sm text-orange-600 font-medium italic">
                      Message: {myData.attendance < passingAttendance ? `Low attendance (<${passingAttendance}%) is causing failure.` : 
                                myData.assignmentMarks < passingAssignment ? `Low assignment marks (<${passingAssignment}) is causing failure.` : 
                                "Needs Improvement in overall marks."}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
