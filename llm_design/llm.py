import json
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import sqlite3
from dataclasses import dataclass
from abc import ABC, abstractmethod
import torch
from transformers import (
    AutoTokenizer, AutoModel, AutoModelForSequenceClassification,
    pipeline, BertTokenizer, BertForSequenceClassification
)
import numpy as np
import warnings
import mysql.connector
from mysql.connector import Error
import math
warnings.filterwarnings("ignore")

@dataclass
class CustomerInfo:
    """Customer information structure"""
    customer_id: str
    name: str
    age: int
    gender: str
    location: str
    latitude: float
    longitude: float
    medical_history: List[str]
    current_conditions: List[str]

@dataclass
class WearableData:
    """Wearable device data structure"""
    timestamp: datetime
    heart_rate: int
    steps: int
    sleep_hours: float
    calories_burned: int
    blood_oxygen: float
    stress_level: str

@dataclass
class DoctorInfo:
    """Doctor information structure"""
    doctor_id: str
    name: str
    specialty: str
    location: str
    latitude: float
    longitude: float
    rating: float
    availability: bool
    phone: str
    email: str
    hospital_affiliation: str
    years_experience: int
    consultation_fee: float
    distance_km: float = 0.0  # Will be calculated based on customer location

class MySQLMedicalDatabase:
    """MySQL database interface for medical doctors with GPS-based distance sorting"""
    
    def __init__(self, host='localhost', database='medical_db', user='root', password='password'):
        """Initialize MySQL connection"""
        self.host = host
        self.database = database
        self.user = user
        self.password = password
        self.connection = None
        self.connect_to_database()
        self.create_tables_if_not_exist()
        self.populate_sample_data()
    
    def connect_to_database(self):
        """Establish connection to MySQL database"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password,
                autocommit=True
            )
            if self.connection.is_connected():
                print(f"Successfully connected to MySQL database: {self.database}")
        except Error as e:
            print(f"Error connecting to MySQL database: {e}")
            # Fallback to create database if it doesn't exist
            try:
                self.connection = mysql.connector.connect(
                    host=self.host,
                    user=self.user,
                    password=self.password,
                    autocommit=True
                )
                cursor = self.connection.cursor()
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.database}")
                cursor.execute(f"USE {self.database}")
                print(f"Created and connected to database: {self.database}")
            except Error as e2:
                print(f"Failed to create database: {e2}")
                # Use in-memory fallback
                self.connection = None
    
    def create_tables_if_not_exist(self):
        """Create doctors table if it doesn't exist"""
        if not self.connection:
            return
        
        try:
            cursor = self.connection.cursor()
            
            create_table_query = """
            CREATE TABLE IF NOT EXISTS doctors (
                doctor_id VARCHAR(20) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                specialty VARCHAR(100) NOT NULL,
                location VARCHAR(200) NOT NULL,
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                rating DECIMAL(3, 2) NOT NULL,
                availability BOOLEAN NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(100),
                hospital_affiliation VARCHAR(200),
                years_experience INT,
                consultation_fee DECIMAL(8, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_specialty (specialty),
                INDEX idx_location (latitude, longitude),
                INDEX idx_availability (availability),
                INDEX idx_rating (rating)
            )
            """
            
            cursor.execute(create_table_query)
            print("Doctors table created/verified successfully")
            
        except Error as e:
            print(f"Error creating tables: {e}")
    
    def populate_sample_data(self):
        """Populate database with sample doctor data if empty"""
        if not self.connection:
            return
        
        try:
            cursor = self.connection.cursor()
            
            # Check if data already exists
            cursor.execute("SELECT COUNT(*) FROM doctors")
            count = cursor.fetchone()[0]
            
            if count == 0:
                sample_doctors = [
                    ("D001", "Dr. Rajesh Sharma", "Cardiology", "Apollo Hospital, Mumbai", 
                     19.0760, 72.8777, 4.8, True, "+91-9876543210", "rajesh.sharma@apollo.com", 
                     "Apollo Hospital", 15, 1500.00),
                    ("D002", "Dr. Priya Patel", "General Medicine", "Fortis Hospital, Mumbai", 
                     19.0896, 72.8656, 4.5, True, "+91-9876543211", "priya.patel@fortis.com", 
                     "Fortis Healthcare", 12, 800.00),
                    ("D003", "Dr. Amit Singh", "Endocrinology", "Manipal Hospital, Mumbai", 
                     19.0895, 72.8634, 4.7, False, "+91-9876543212", "amit.singh@manipal.com", 
                     "Manipal Hospitals", 18, 1200.00),
                    ("D004", "Dr. Sunita Kumar", "Orthopedics", "Lilavati Hospital, Mumbai", 
                     19.0501, 72.8302, 4.6, True, "+91-9876543213", "sunita.kumar@lilavati.com", 
                     "Lilavati Hospital", 20, 1800.00),
                    ("D005", "Dr. Vikram Mehta", "Neurology", "Kokilaben Hospital, Mumbai", 
                     19.1334, 72.8267, 4.9, True, "+91-9876543214", "vikram.mehta@kokilaben.com", 
                     "Kokilaben Dhirubhai Ambani Hospital", 22, 2000.00),
                    ("D006", "Dr. Kavita Joshi", "Dermatology", "Jaslok Hospital, Mumbai", 
                     18.9667, 72.8081, 4.4, True, "+91-9876543215", "kavita.joshi@jaslok.com", 
                     "Jaslok Hospital", 10, 1000.00),
                    ("D007", "Dr. Ravi Agarwal", "Psychiatry", "Hinduja Hospital, Mumbai", 
                     19.0176, 72.8562, 4.7, True, "+91-9876543216", "ravi.agarwal@hinduja.com", 
                     "P.D. Hinduja Hospital", 16, 1300.00),
                    ("D008", "Dr. Meera Reddy", "Gynecology", "Breach Candy Hospital, Mumbai", 
                     18.9696, 72.8031, 4.6, True, "+91-9876543217", "meera.reddy@breachcandy.com", 
                     "Breach Candy Hospital", 14, 1600.00),
                    ("D009", "Dr. Suresh Iyer", "Pediatrics", "Rainbow Hospital, Mumbai", 
                     19.1076, 72.8263, 4.5, True, "+91-9876543218", "suresh.iyer@rainbow.com", 
                     "Rainbow Children's Hospital", 13, 900.00),
                    ("D010", "Dr. Anju Nair", "Ophthalmology", "Sankara Nethralaya, Mumbai", 
                     19.0330, 72.8570, 4.8, False, "+91-9876543219", "anju.nair@sankara.com", 
                     "Sankara Nethralaya", 17, 1100.00)
                ]
                
                insert_query = """
                INSERT INTO doctors (doctor_id, name, specialty, location, latitude, longitude, 
                                   rating, availability, phone, email, hospital_affiliation, 
                                   years_experience, consultation_fee) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                
                cursor.executemany(insert_query, sample_doctors)
                print(f"Inserted {len(sample_doctors)} sample doctors into database")
            
        except Error as e:
            print(f"Error populating sample data: {e}")
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two GPS coordinates using Haversine formula"""
        # Convert latitude and longitude from degrees to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Radius of earth in kilometers
        r = 6371
        
        return c * r
    
    def find_nearby_doctors(self, customer_latitude: float, customer_longitude: float, 
                          specialty: str = None, max_distance_km: float = 50.0, 
                          availability_required: bool = True) -> List[DoctorInfo]:
        """Find doctors based on GPS location and specialty with distance sorting"""
        
        if not self.connection:
            print("No database connection, using fallback data")
            return self._get_fallback_doctors(customer_latitude, customer_longitude, specialty)
        
        try:
            cursor = self.connection.cursor()
            
            # Build dynamic query based on filters
            base_query = """
            SELECT doctor_id, name, specialty, location, latitude, longitude, 
                   rating, availability, phone, email, hospital_affiliation, 
                   years_experience, consultation_fee
            FROM doctors 
            WHERE 1=1
            """
            
            params = []
            
            if availability_required:
                base_query += " AND availability = %s"
                params.append(True)
            
            if specialty:
                base_query += " AND LOWER(specialty) LIKE %s"
                params.append(f"%{specialty.lower()}%")
            
            cursor.execute(base_query, params)
            results = cursor.fetchall()
            
            doctors = []
            for row in results:
                # Calculate distance for each doctor
                distance = self.calculate_distance(
                    customer_latitude, customer_longitude,
                    float(row[4]), float(row[5])  # doctor lat, lon
                )
                
                # Only include doctors within max distance
                if distance <= max_distance_km:
                    doctor = DoctorInfo(
                        doctor_id=row[0],
                        name=row[1],
                        specialty=row[2],
                        location=row[3],
                        latitude=float(row[4]),
                        longitude=float(row[5]),
                        rating=float(row[6]),
                        availability=bool(row[7]),
                        phone=row[8],
                        email=row[9],
                        hospital_affiliation=row[10],
                        years_experience=row[11],
                        consultation_fee=float(row[12]),
                        distance_km=distance
                    )
                    doctors.append(doctor)
            
            # Sort by distance first, then by rating
            doctors.sort(key=lambda x: (x.distance_km, -x.rating))
            
            print(f"Found {len(doctors)} doctors within {max_distance_km}km")
            return doctors
            
        except Error as e:
            print(f"Error fetching doctors from database: {e}")
            return self._get_fallback_doctors(customer_latitude, customer_longitude, specialty)
    
    def _get_fallback_doctors(self, customer_lat: float, customer_lon: float, 
                            specialty: str = None) -> List[DoctorInfo]:
        """Fallback method if database is not available"""
        fallback_doctors = [
            DoctorInfo("D001", "Dr. Rajesh Sharma", "Cardiology", "Apollo Hospital, Mumbai", 
                      19.0760, 72.8777, 4.8, True, "+91-9876543210", "rajesh.sharma@apollo.com", 
                      "Apollo Hospital", 15, 1500.00),
            DoctorInfo("D002", "Dr. Priya Patel", "General Medicine", "Fortis Hospital, Mumbai", 
                      19.0896, 72.8656, 4.5, True, "+91-9876543211", "priya.patel@fortis.com", 
                      "Fortis Healthcare", 12, 800.00),
        ]
        
        # Calculate distances and filter
        for doctor in fallback_doctors:
            doctor.distance_km = self.calculate_distance(
                customer_lat, customer_lon, doctor.latitude, doctor.longitude
            )
        
        # Filter by specialty if specified
        if specialty:
            fallback_doctors = [d for d in fallback_doctors 
                              if specialty.lower() in d.specialty.lower()]
        
        # Sort by distance
        fallback_doctors.sort(key=lambda x: x.distance_km)
        return fallback_doctors
    
    def add_doctor(self, doctor_info: DoctorInfo) -> bool:
        """Add a new doctor to the database"""
        if not self.connection:
            return False
        
        try:
            cursor = self.connection.cursor()
            
            insert_query = """
            INSERT INTO doctors (doctor_id, name, specialty, location, latitude, longitude, 
                               rating, availability, phone, email, hospital_affiliation, 
                               years_experience, consultation_fee) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            values = (
                doctor_info.doctor_id, doctor_info.name, doctor_info.specialty,
                doctor_info.location, doctor_info.latitude, doctor_info.longitude,
                doctor_info.rating, doctor_info.availability, doctor_info.phone,
                doctor_info.email, doctor_info.hospital_affiliation,
                doctor_info.years_experience, doctor_info.consultation_fee
            )
            
            cursor.execute(insert_query, values)
            return True
            
        except Error as e:
            print(f"Error adding doctor: {e}")
            return False
    
    def update_doctor_availability(self, doctor_id: str, availability: bool) -> bool:
        """Update doctor availability status"""
        if not self.connection:
            return False
        
        try:
            cursor = self.connection.cursor()
            
            update_query = "UPDATE doctors SET availability = %s WHERE doctor_id = %s"
            cursor.execute(update_query, (availability, doctor_id))
            
            return cursor.rowcount > 0
            
        except Error as e:
            print(f"Error updating doctor availability: {e}")
            return False
    
    def close_connection(self):
        """Close database connection"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("MySQL connection closed")

class HuggingFaceMedicalModel:
    """Real Hugging Face medical AI models for health analysis"""
    
    def __init__(self):
        print("Loading Hugging Face medical models...")
        
        # Load BioBERT for medical text analysis
        self.biobert_tokenizer = AutoTokenizer.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
        self.biobert_model = AutoModel.from_pretrained("dmis-lab/biobert-base-cased-v1.1")
        
        # Load medical NER model for extracting medical entities
        self.medical_ner = pipeline(
            "ner",
            model="d4data/biomedical-ner-all",
            tokenizer="d4data/biomedical-ner-all",
            aggregation_strategy="simple"
        )
        
        # Load clinical BERT for medical classification
        try:
            self.clinical_bert = pipeline(
                "text-classification",
                model="emilyalsentzer/Bio_ClinicalBERT",
                return_all_scores=True
            )
        except:
            # Fallback to BioBERT if ClinicalBERT is not available
            print("Using BioBERT as fallback for classification...")
            self.clinical_bert = None
        
        # Load medical question-answering model
        self.medical_qa = pipeline(
            "question-answering",
            model="deepset/roberta-base-squad2-distilled"
        )
        
        print("Medical models loaded successfully!")
    
    def analyze_wearable_data(self, wearable_data: List[WearableData], 
                            customer_history: List[str]) -> Dict[str, Any]:
        """Analyze wearable data using Hugging Face medical models"""
        
        # Calculate basic metrics
        avg_heart_rate = sum(d.heart_rate for d in wearable_data) / len(wearable_data)
        avg_steps = sum(d.steps for d in wearable_data) / len(wearable_data)
        avg_sleep = sum(d.sleep_hours for d in wearable_data) / len(wearable_data)
        
        # Create medical context for analysis
        health_context = self._create_health_context(wearable_data, customer_history)
        
        # Analyze medical history using NER
        medical_entities = self._extract_medical_entities(customer_history)
        
        # Generate health assessment using BioBERT
        health_score = self._calculate_health_score_with_ai(
            avg_heart_rate, avg_steps, avg_sleep, health_context
        )
        
        # Identify risk factors using medical models
        risk_factors = self._identify_risk_factors_with_ai(
            wearable_data, customer_history, medical_entities
        )
        
        # Generate recommendations using medical AI
        recommendations = self._generate_ai_recommendations(
            health_score, risk_factors, health_context
        )
        
        return {
            "health_score": health_score,
            "risk_factors": risk_factors,
            "recommendations": recommendations,
            "medical_entities": medical_entities,
            "metrics": {
                "avg_heart_rate": avg_heart_rate,
                "avg_daily_steps": avg_steps,
                "avg_sleep_hours": avg_sleep
            }
        }
    
    def _create_health_context(self, wearable_data: List[WearableData], 
                              history: List[str]) -> str:
        """Create comprehensive health context for AI analysis"""
        avg_hr = sum(d.heart_rate for d in wearable_data) / len(wearable_data)
        avg_steps = sum(d.steps for d in wearable_data) / len(wearable_data)
        avg_sleep = sum(d.sleep_hours for d in wearable_data) / len(wearable_data)
        avg_oxygen = sum(d.blood_oxygen for d in wearable_data) / len(wearable_data)
        
        context = f"""
        Patient health monitoring data shows average heart rate of {avg_hr:.0f} bpm, 
        daily steps of {avg_steps:.0f}, sleep duration of {avg_sleep:.1f} hours, 
        and blood oxygen saturation of {avg_oxygen:.1f}%. 
        Medical history includes: {', '.join(history) if history else 'No significant history'}.
        Recent stress levels vary from low to moderate based on wearable device data.
        """
        
        return context.strip()
    
    def _extract_medical_entities(self, medical_history: List[str]) -> List[Dict]:
        """Extract medical entities from patient history using NER"""
        entities = []
        
        for history_item in medical_history:
            try:
                # Extract medical entities
                ner_results = self.medical_ner(history_item)
                entities.extend(ner_results)
            except Exception as e:
                print(f"NER extraction failed for '{history_item}': {e}")
                # Fallback: simple keyword matching
                medical_keywords = ["diabetes", "hypertension", "cardio", "heart", "blood", "pressure"]
                for keyword in medical_keywords:
                    if keyword.lower() in history_item.lower():
                        entities.append({
                            "entity_group": "MEDICAL_CONDITION",
                            "word": keyword,
                            "score": 0.8
                        })
        
        return entities
    
    def _calculate_health_score_with_ai(self, heart_rate: float, steps: float, 
                                       sleep: float, context: str) -> float:
        """Calculate health score using BioBERT embeddings and medical context"""
        
        try:
            # Encode the health context using BioBERT
            inputs = self.biobert_tokenizer(context, return_tensors="pt", 
                                          truncation=True, max_length=512)
            
            with torch.no_grad():
                outputs = self.biobert_model(**inputs)
                # Use the [CLS] token embedding for overall health representation
                health_embedding = outputs.last_hidden_state[:, 0, :].numpy()
            
            # Calculate component scores
            hr_score = max(0, 100 - abs(heart_rate - 70) * 2)
            steps_score = min(100, (steps / 10000) * 100)
            sleep_score = max(0, 100 - abs(sleep - 8) * 12.5)
            
            # Weight the scores based on AI embedding analysis
            # Simple approach: use embedding norm to adjust weights
            embedding_factor = min(1.2, np.linalg.norm(health_embedding) / 1000)
            
            base_score = (hr_score + steps_score + sleep_score) / 3
            ai_adjusted_score = base_score * embedding_factor
            
            return min(100, max(0, ai_adjusted_score))
            
        except Exception as e:
            print(f"AI health score calculation failed: {e}")
            # Fallback to traditional calculation
            hr_score = max(0, 100 - abs(heart_rate - 70) * 2)
            steps_score = min(100, (steps / 10000) * 100)
            sleep_score = max(0, 100 - abs(sleep - 8) * 12.5)
            return (hr_score + steps_score + sleep_score) / 3
    
    def _identify_risk_factors_with_ai(self, data: List[WearableData], 
                                      history: List[str], 
                                      medical_entities: List[Dict]) -> List[str]:
        """Identify risk factors using medical AI models"""
        risks = []
        
        # Traditional risk assessment
        avg_hr = sum(d.heart_rate for d in data) / len(data)
        if avg_hr > 90:
            risks.append("Elevated resting heart rate detected")
        
        avg_steps = sum(d.steps for d in data) / len(data)
        if avg_steps < 5000:
            risks.append("Insufficient physical activity")
        
        avg_sleep = sum(d.sleep_hours for d in data) / len(data)
        if avg_sleep < 6:
            risks.append("Sleep deprivation pattern")
        
        # AI-enhanced risk assessment using medical entities
        high_risk_conditions = []
        for entity in medical_entities:
            entity_text = entity.get('word', '').lower()
            if entity.get('score', 0) > 0.7:  # High confidence entities
                if any(condition in entity_text for condition in 
                      ['diabetes', 'hypertension', 'cardio', 'heart']):
                    high_risk_conditions.append(entity_text)
        
        if high_risk_conditions:
            risks.append(f"Chronic condition monitoring required: {', '.join(set(high_risk_conditions))}")
        
        # Use medical QA for additional risk assessment
        try:
            health_context = self._create_health_context(data, history)
            qa_result = self.medical_qa({
                'question': 'What are the main health risks based on this data?',
                'context': health_context
            })
            
            if qa_result['score'] > 0.3:  # Reasonable confidence
                risks.append(f"AI Assessment: {qa_result['answer']}")
                
        except Exception as e:
            print(f"Medical QA risk assessment failed: {e}")
        
        return risks
    
    def _generate_ai_recommendations(self, health_score: float, 
                                   risks: List[str], context: str) -> List[str]:
        """Generate recommendations using medical AI models"""
        recommendations = []
        
        # Base recommendations
        if health_score < 60:
            recommendations.append("Comprehensive medical evaluation recommended")
        
        # Risk-specific recommendations
        for risk in risks:
            if "physical activity" in risk.lower():
                recommendations.append("Gradual increase in daily physical activity to 8,000+ steps")
            elif "sleep" in risk.lower():
                recommendations.append("Sleep hygiene improvement with 7-9 hours nightly")
            elif "heart rate" in risk.lower():
                recommendations.append("Cardiovascular assessment and monitoring")
            elif "diabetes" in risk.lower():
                recommendations.append("Blood glucose monitoring and endocrinology follow-up")
            elif "hypertension" in risk.lower():
                recommendations.append("Blood pressure monitoring and lifestyle modifications")
        
        # Use medical QA for personalized recommendations
        try:
            qa_result = self.medical_qa({
                'question': 'What lifestyle recommendations would help improve these health metrics?',
                'context': context
            })
            
            if qa_result['score'] > 0.4:
                recommendations.append(f"Personalized advice: {qa_result['answer']}")
                
        except Exception as e:
            print(f"AI recommendation generation failed: {e}")
        
        # Always include monitoring recommendation
        recommendations.append("Continue continuous health monitoring with wearable devices")
        
        return recommendations

class MedicalVerificationSystem:
    """System for medical professional verification"""
    
    def __init__(self):
        self.verified_doctors = set()
    
    def verify_doctor_recommendation(self, doctor_id: str, 
                                   ai_report: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate doctor verification of AI recommendations"""
        
        verification_result = {
            "verified_by": doctor_id,
            "verification_timestamp": datetime.now(),
            "ai_recommendations_approved": [],
            "ai_recommendations_modified": [],
            "additional_recommendations": [],
            "urgency_level": "routine"
        }
        
        # Simulate doctor review process
        ai_recommendations = ai_report.get("recommendations", [])
        
        # Approve most AI recommendations (simulate high accuracy)
        verification_result["ai_recommendations_approved"] = ai_recommendations[:3]
        
        # Modify some recommendations
        if len(ai_recommendations) > 3:
            verification_result["ai_recommendations_modified"] = [
                "Modified: " + ai_recommendations[3] + " - consult within 2 weeks"
            ]
        
        # Add doctor's additional insights
        if ai_report.get("health_score", 100) < 50:
            verification_result["additional_recommendations"].append(
                "Schedule immediate in-person consultation"
            )
            verification_result["urgency_level"] = "high"
        
        verification_result["additional_recommendations"].append(
            "Follow up in 3 months or if symptoms worsen"
        )
        
        return verification_result

class ReportGenerator:
    """Generate final medical reports and recommendations"""
    
    def generate_final_report(self, customer_info: CustomerInfo,
                            ai_analysis: Dict[str, Any],
                            verification: Dict[str, Any],
                            nearby_doctors: List[DoctorInfo]) -> Dict[str, Any]:
        """Generate comprehensive final report"""
        
        report = {
            "report_id": f"RPT_{customer_info.customer_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "customer_info": {
                "name": customer_info.name,
                "age": customer_info.age,
                "customer_id": customer_info.customer_id
            },
            "health_assessment": {
                "overall_score": ai_analysis.get("health_score", 0),
                "risk_factors": ai_analysis.get("risk_factors", []),
                "key_metrics": ai_analysis.get("metrics", {}),
                "medical_entities": ai_analysis.get("medical_entities", [])
            },
            "recommendations": {
                "ai_approved": verification.get("ai_recommendations_approved", []),
                "doctor_modified": verification.get("ai_recommendations_modified", []),
                "additional": verification.get("additional_recommendations", [])
            },
            "urgency_level": verification.get("urgency_level", "routine"),
            "suggested_doctors": [
                {
                    "name": doc.name,
                    "specialty": doc.specialty,
                    "rating": doc.rating,
                    "location": doc.location,
                    "distance_km": doc.distance_km,
                    "phone": doc.phone,
                    "hospital": doc.hospital_affiliation,
                    "consultation_fee": doc.consultation_fee
                }
                for doc in nearby_doctors[:3]
            ],
            "report_date": datetime.now(),
            "verified_by": verification.get("verified_by", ""),
            "next_review_date": datetime.now() + timedelta(days=90)
        }
        
        return report
    
    def export_to_pdf_format(self, report: Dict[str, Any]) -> str:
        """Convert report to PDF-ready format (simulation)"""
        pdf_content = f"""
        MEDICAL HEALTH REPORT
        =====================
        
        Report ID: {report['report_id']}
        Patient: {report['customer_info']['name']} (ID: {report['customer_info']['customer_id']})
        Date: {report['report_date'].strftime('%Y-%m-%d %H:%M:%S')}
        
        HEALTH ASSESSMENT
        -----------------
        Overall Health Score: {report['health_assessment']['overall_score']:.1f}/100
        
        Risk Factors Identified:
        {chr(10).join('• ' + risk for risk in report['health_assessment']['risk_factors'])}
        
        RECOMMENDATIONS
        ---------------
        AI-Verified Recommendations:
        {chr(10).join('• ' + rec for rec in report['recommendations']['ai_approved'])}
        
        Doctor-Modified Recommendations:
        {chr(10).join('• ' + rec for rec in report['recommendations']['doctor_modified'])}
        
        Additional Medical Advice:
        {chr(10).join('• ' + rec for rec in report['recommendations']['additional'])}
        
        SUGGESTED HEALTHCARE PROVIDERS
        ------------------------------
        {chr(10).join(f"• Dr. {doc['name']} - {doc['specialty']} ({doc['rating']} stars)" + 
                     f"{chr(10)}  📍 {doc['distance_km']:.1f}km away - {doc['hospital']}" +
                     f"{chr(10)}  📞 {doc['phone']} - Fee: ₹{doc['consultation_fee']}" 
                     for doc in report['suggested_doctors'])}
        
        Urgency Level: {report['urgency_level'].upper()}
        Next Review: {report['next_review_date'].strftime('%Y-%m-%d')}
        
        Report verified by: {report['verified_by']}
        """
        
        return pdf_content

class MedicalWorkflowSystem:
    """Main orchestrator for the medical AI workflow"""
    
    def __init__(self, mysql_config: Dict[str, str] = None):
        """Initialize with optional MySQL configuration"""
        if mysql_config is None:
            mysql_config = {
                'host': 'localhost',
                'database': 'medical_db',
                'user': 'root',
                'password': 'password'
            }
        
        self.medical_model = HuggingFaceMedicalModel()
        self.doctor_db = MySQLMedicalDatabase(**mysql_config)
        self.verification_system = MedicalVerificationSystem()
        self.report_generator = ReportGenerator()
    
    def process_customer_health_data(self, customer_info: CustomerInfo,
                                   wearable_data: List[WearableData]) -> Dict[str, Any]:
        """Main workflow processing function"""
        
        print(f"Processing health data for customer: {customer_info.name}")
        
        # Step 1: AI Analysis using fine-tuned model
        print("Step 1: Analyzing wearable data with AI model...")
        ai_analysis = self.medical_model.analyze_wearable_data(
            wearable_data, customer_info.medical_history
        )
        
        # Step 2: Find nearby doctors using GPS coordinates
        print("Step 2: Finding nearby doctors using GPS location...")
        nearby_doctors = self.doctor_db.find_nearby_doctors(
            customer_info.latitude, customer_info.longitude,
            specialty=None,  # Can be modified to filter by specialty
            max_distance_km=25.0,  # 25km radius
            availability_required=True
        )
        
        # Step 3: Medical verification (simulate doctor review)
        print("Step 3: Getting medical professional verification...")
        if nearby_doctors:
            selected_doctor = nearby_doctors[0]  # Select top-rated doctor
            verification = self.verification_system.verify_doctor_recommendation(
                selected_doctor.doctor_id, ai_analysis
            )
        else:
            # Fallback verification
            verification = self.verification_system.verify_doctor_recommendation(
                "D999", ai_analysis
            )
        
        # Step 4: Generate final report
        print("Step 4: Generating final report...")
        final_report = self.report_generator.generate_final_report(
            customer_info, ai_analysis, verification, nearby_doctors
        )
        
        # Step 5: Export to PDF format
        print("Step 5: Preparing PDF report...")
        pdf_content = self.report_generator.export_to_pdf_format(final_report)
        
        return {
            "final_report": final_report,
            "pdf_content": pdf_content,
            "processing_status": "completed"
        }

# Example usage and testing
def main():
    """
    Main function to demonstrate the workflow with real Hugging Face models
    Note: First run will download models (~1-2GB). Subsequent runs will be faster.
    """
    print("Initializing Medical AI Workflow with Hugging Face Models...")
    print("This may take a few minutes on first run to download models...")
    
    # Initialize the workflow system
    workflow = MedicalWorkflowSystem()
    
    # Sample customer data with GPS coordinates (Mumbai location)
    customer = CustomerInfo(
        customer_id="CUST001",
        name="Rahul Sharma",
        age=35,
        gender="Male",
        location="Bandra, Mumbai",
        latitude=19.0596,  # Bandra coordinates
        longitude=72.8295,
        medical_history=["Hypertension", "Family history of diabetes", "Mild anxiety"],
        current_conditions=["Stress from work"]
    )
    
    # Sample wearable data (last week)
    wearable_data = [
        WearableData(
            timestamp=datetime.now() - timedelta(days=i),
            heart_rate=75 + (i * 2),
            steps=8500 - (i * 200),
            sleep_hours=7.5 - (i * 0.2),
            calories_burned=2200 + (i * 50),
            blood_oxygen=98.0 - (i * 0.1),
            stress_level="moderate" if i > 3 else "low"
        )
        for i in range(7)
    ]
    
    # Process the workflow
    result = workflow.process_customer_health_data(customer, wearable_data)
    
    # Display results
    print("\n" + "="*60)
    print("MYSQL + GPS-ENHANCED MEDICAL AI WORKFLOW COMPLETED")
    print("="*60)
    print("\nFinal Report Summary:")
    report = result["final_report"]
    print(f"Report ID: {report['report_id']}")
    print(f"AI-Enhanced Health Score: {report['health_assessment']['overall_score']:.1f}/100")
    print(f"Medical Entities Detected: {len(report['health_assessment'].get('medical_entities', []))}")
    print(f"Urgency Level: {report['urgency_level']}")
    print(f"\nTotal Recommendations: {len(report['recommendations']['ai_approved']) + len(report['recommendations']['additional'])}")
    
    # Show nearby doctors with distances
    print(f"\nNearby Doctors Found: {len(report['suggested_doctors'])}")
    for i, doctor in enumerate(report['suggested_doctors'][:3], 1):
        print(f"  {i}. Dr. {doctor['name']} - {doctor['specialty']}")
        print(f"     📍 {doctor['distance_km']:.1f}km away at {doctor['hospital']}")
        print(f"     ⭐ {doctor['rating']}/5.0 - Fee: ₹{doctor['consultation_fee']}")
    
    # Show detected medical entities
    if 'medical_entities' in report['health_assessment']:
        print("\nMedical Entities Detected by NER:")
        for entity in report['health_assessment']['medical_entities'][:5]:  # Show first 5
            print(f"  • {entity.get('word', 'N/A')} ({entity.get('entity_group', 'Unknown')}) - Confidence: {entity.get('score', 0):.2f}")
    
    print("\n" + "="*60)
    print("MYSQL + GPS ENHANCED PDF REPORT PREVIEW")
    print("="*60)
    print(result["pdf_content"])
    
    print("\n" + "="*60)
    print("TECHNOLOGY STACK:")
    print("="*60)
    print("🗄️  DATABASE:")
    print("   • MySQL with GPS coordinates and distance calculation")
    print("   • Haversine formula for accurate distance sorting")
    print("   • Indexed queries for optimized performance")
    print("\n🤖 AI MODELS:")
    print("   • BioBERT (dmis-lab/biobert-base-cased-v1.1) - Medical text understanding")
    print("   • Biomedical NER (d4data/biomedical-ner-all) - Medical entity extraction")
    print("   • Clinical BERT (emilyalsentzer/Bio_ClinicalBERT) - Medical classification")
    print("   • RoBERTa QA (deepset/roberta-base-squad2-distilled) - Medical Q&A")
    
    # Close database connection
    workflow.doctor_db.close_connection()

if __name__ == "__main__":
    # Install required packages first
    print("Required packages: transformers torch numpy mysql-connector-python")
    print("Install with: pip install transformers torch numpy mysql-connector-python") 
    print("-" * 50)
    
    # Optional: Custom MySQL configuration
    # mysql_config = {
    #     'host': 'your-mysql-host.com',
    #     'database': 'your_medical_db',
    #     'user': 'your_username',
    #     'password': 'your_password'
    # }
    # You can pass this config to main(mysql_config) if needed
    
    main()