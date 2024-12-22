using HW1.DAL;

namespace HW1.BL
{
    public class User
    {

            int id;
            string userName;
            string email;
            string password;

        public int Id { get => id; set => id = value; }
        public string UserName { get => userName; set => userName = value; }
        public string Email { get => email; set => email = value; }
        public string Password { get => password; set => password = value; }

        public User()
        {}

        //regestration
         public bool InsertUser()
        {
            try
            {
                DBService dB = new DBService();
                return dB.InsertUser(this);
            }
            catch (Exception)
            {
                return false;
            }
        }

        // Login
         public int LoginUser()
        {
            try
            {
                DBService dbService = new DBService();
                return dbService.ReadUser(this.UserName, this.Password); // Calls DAL method
            }
            catch (Exception)
            {
                return -1;
            }
        }






    }
}
