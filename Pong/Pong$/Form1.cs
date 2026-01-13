using System.Runtime.CompilerServices;

namespace Pong_
{
    public partial class Form1 : Form
    {

        // Positions des raquettes et de la balle
        private int raquette1Y;
        private int raquette2Y;
        private int balleX, balleY;

        // Vitesse de déplacement de la balle
        private int balleVitesseX = 5;
        private int balleVitesseY = 5;

        // Dimensions des raquettes et de la balle
        private const int largeurRaquette = 10;
        private const int hauteurRaquette = 80;
        private const int tailleBalle = 15;

        // État des touches pour les deux raquettes
        private bool raquette1Haut;
        private bool raquette1Bas;
        private bool raquette2Haut;
        private bool raquette2Bas;

        // Scores des joueurs
        private int scoreJoueur1 = 0;
        private int scoreJoueur2 = 0;
        public Form1()
        {
            InitializeComponent();

            // Position initiale des raquettes et de la balle
            this.KeyPreview = true;
            this.DoubleBuffered = true;
            // Position initiale des raquettes et de la balle
            raquette1Y = this.ClientSize.Height / 2 - hauteurRaquette / 2;
            raquette2Y = this.ClientSize.Height / 2 - hauteurRaquette / 2;
            balleX = this.ClientSize.Width / 2 - tailleBalle / 2;
            balleY = this.ClientSize.Height / 2 - tailleBalle / 2;

            // Démarre le timer automatiquement
            timer1.Interval = 16;  // Pour environ 60 FPS
            timer1.Start();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            // Déplacement des raquettes
            if (raquette1Haut && raquette1Y > 0)
                raquette1Y -= 10;
            if (raquette1Bas && raquette1Y < this.ClientSize.Height - hauteurRaquette)
                raquette1Y += 10;
            if (raquette2Haut && raquette2Y > 0)
                raquette2Y -= 10;
            if (raquette2Bas && raquette2Y < this.ClientSize.Height - hauteurRaquette)
                raquette2Y += 10;

            // Déplacement de la balle
            balleX += balleVitesseX;
            balleY += balleVitesseY;

            // Collision avec le haut et le bas de la fenêtre
            if (balleY <= 0 || balleY >= this.ClientSize.Height - tailleBalle)
                balleVitesseY = -balleVitesseY;

            // Collision avec la raquette gauche (joueur 1)
            if (balleX <= largeurRaquette &&
                balleY + tailleBalle >= raquette1Y && balleY <= raquette1Y + hauteurRaquette)
                balleVitesseX = -balleVitesseX;

            // Collision avec la raquette droite (joueur 2)
            if (balleX >= this.ClientSize.Width - largeurRaquette - tailleBalle &&
                balleY + tailleBalle >= raquette2Y && balleY <= raquette2Y + hauteurRaquette)
                balleVitesseX = -balleVitesseX;

            // Si la balle sort du terrain (réinitialisation simple)
            if (balleX <= 0)
            {
                // Joueur 2 marque un point
                scoreJoueur2++;
                ResetBalle();
            }
            else if (balleX >= this.ClientSize.Width - tailleBalle)
            {
                // Joueur 1 marque un point
                scoreJoueur1++;
                ResetBalle();
            }

            // Redessine la fenêtre
            this.Invalidate();
        }


        // Remise à zéro de la balle au centre
        private void ResetBalle()
        {
            balleX = this.ClientSize.Width / 2 - tailleBalle / 2;
            balleY = this.ClientSize.Height / 2 - tailleBalle / 2;
            balleVitesseX = -balleVitesseX;
        }
        // Dessine les éléments du jeu
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Graphics g = e.Graphics;

            // Dessiner la balle
            g.FillEllipse(Brushes.Black, balleX, balleY, tailleBalle, tailleBalle);

            // Dessiner la raquette gauche (joueur 1)
            g.FillRectangle(Brushes.Blue, 0, raquette1Y, largeurRaquette, hauteurRaquette);

            // Dessiner la raquette droite (joueur 2)
            g.FillRectangle(Brushes.Red, this.ClientSize.Width - largeurRaquette, raquette2Y, largeurRaquette, hauteurRaquette);


            // Dessiner les scores 
            Font scoreFont = new Font("Arial", 24);
            Brush scoreBrush = Brushes.Black;
            g.DrawString($"Joueur 1: {scoreJoueur1}", scoreFont, scoreBrush, 10, 10);
            g.DrawString($"Joueur 2: {scoreJoueur2}", scoreFont, scoreBrush,600, 10);


        }

        private void Form1_KeyUp(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                // Raquette gauche (joueur 1)
                case Keys.W:
                    raquette1Haut = false;
                    break;
                case Keys.S:
                    raquette1Bas = false;
                    break;

                // Raquette droite (joueur 2)
                case Keys.Up:
                    raquette2Haut = false;
                    break;
                case Keys.Down:
                    raquette2Bas = false;
                    break;
            }
        }

        private void Form1_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)  
            {
                // Raquette gauche (joueur 1)
                case Keys.W:
                    raquette1Haut = true;
                    break;
                case Keys.S:
                    raquette1Bas = true;
                    break;

                // Raquette droite (joueur 2)
                case Keys.Up:
                    raquette2Haut = true;
                    break;
                case Keys.Down:
                    raquette2Bas = true;
                    break;
            }

        }
        }
}

