using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Pong_
{   
    public partial class Form2 : Form
    {
       
        public Form2()
        {
            InitializeComponent();

            // Créer le bouton pour lancer Form1
            Button buttonForm1 = new Button();
            buttonForm1.Text = "Ping Pong";
            buttonForm1.Width = 500;
            buttonForm1.Height = 150;
            buttonForm1.Location = new Point(140, 80);  // Positionner le bouton
            buttonForm1.Click += ButtonForm1_Click;  // Ajouter un gestionnaire d'événements
            this.Controls.Add(buttonForm1);  // Ajouter le bouton au formulaire

            // Créer le bouton pour lancer le Projet 3
            Button buttonProjet3 = new Button();
            buttonProjet3.Text = "Horloge";
            buttonProjet3.Width = 500;
            buttonProjet3.Height = 150;
            buttonProjet3.Location = new Point(140, 250);  // Positionner le bouton
            buttonProjet3.Click += ButtonProjet3_Click;  // Ajouter un gestionnaire d'événements
            this.Controls.Add(buttonProjet3);  // Ajouter le bouton au formulaire
        }

        private void ButtonForm1_Click(object sender, EventArgs e)
        {
            // Lancer Form1 sur un autre thread
            Thread thread = new Thread(OpenForm1);
            thread.Start();
            this.Hide();  // Masquer Form2
        }
        private void OpenForm1()
        {
            // Crée une nouvelle instance de Form1 et l'affiche
            Form1 form1 = new Form1();
            Application.Run(form1);  // Utiliser Application.Run pour maintenir l'application en vie sur un autre thread
        }
        private void ButtonProjet3_Click(object sender, EventArgs e)
        {
            // Lancer Projet 3 dans un thread séparé
            Thread thread = new Thread(StartProjet3);
            thread.Start();
        }
        private void StartProjet3()
        {
            try
            {
                // Chemin vers le fichier .exe du projet 3
                string projet3Path = @"C:\Chemin\Vers\Projet3\Projet3.exe";
                Process.Start(projet3Path);  // Lancer Projet3
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erreur lors du lancement du projet 3 : " + ex.Message);
            }
        }
        private void Form2_Load(object sender, EventArgs e)
        {

        }
    }
}
