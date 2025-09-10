export interface Patient {
  id: string;
  name?: string;
  age?: number;
  condition?: string;
  address?: string;
  phone?: string;
  email?: string;
  image?: string; // optional field hai patient image ke liye
}

// export interface Patient {
//   patient_id: number;
//   patient_name: string;
//   age: number;
//   photo_url: string;
//   contact: {
//     address: string;
//     number: string;
//     email: string;
//   }[];
//   medical_issue: string; // optional field hai patient image ke liye
// }
