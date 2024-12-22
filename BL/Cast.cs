using HW1.DAL;

namespace HW1.BL
{
    public class Cast
    {
        string id;
        string name;
        string role;
        DateTime dateOfBirth;
        string country;
        string photoUrl;

        public string Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Role { get => role; set => role = value; }
        public DateTime DateOfBirth { get => dateOfBirth; set => dateOfBirth = value; }
        public string Country { get => country; set => country = value; }
        public string PhotoUrl { get => photoUrl; set => photoUrl = value; }

        public Cast() { }
        public bool InsertCast()
        {
            try
            {
                List<Cast> casts = new List<Cast>();
                DBService dB = new DBService();
                casts = dB.ReadCasts();
                foreach (Cast cast in casts)
                {
                    if (cast.Name == this.Name)
                    {
                        return false;
                    }
                }
                dB.InsertCast(this);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        //static public Cast ReadOneCast(string id)
        //{
        //    for (int i = 0; i < CastsList.Count; i++)
        //        if (CastsList[i].Id == id)
        //            return CastsList[i];
        //    return null;
        //}
        static public List<Cast>  ReadCast()
        {
            DBService dbs = new DBService();
            return dbs.ReadCasts();
        }


    }
}
