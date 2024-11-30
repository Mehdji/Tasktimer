//Composant 'TaskTimer.tsx'
//Mehdi NAOUI BTS SIO SLAM
//21/11/2024

import React, { useEffect, useState } from "react";

interface Task {
  id: number; //Identifiant unique pour (type nombre)
  name: string; //Le nom d'une tâche (du texte)
  timeElapsed: number; //Le temps écoulé en secondes (type nombre)
  isRunning: boolean; //Un booleen pour savoir si le timer est en route
}

const TaskTimer: React.FC = () => {
  //Etat pour stocker la liste des tâches
  //_Les tâches sont ici stocker dans une liste ou bien 'array'.
  //_Nous utilisons <Task[]> pour 'typer' ou en d'autre mots inquer que c'est un tableau(TypeScript)
  //Enfin nous donnons une liste vide car aucune tâche n'est présente au départ
  const [tasks, setTasks] = useState<Task[]>([]);

  //Etat pour stocker le nom de la nouvelles tâches
  //ici le nom est stocker dans un string
  //Nous passons un type string a useState via ('');
  const [newTaskName, setNewTaskName] = useState("");

  //Définition d'une fonction pour ajouter une tâche
  const addTask = () => {
    //Si newTaskName n'est pas vide alirs con crée un nouvelle tâche.
    //_Notons l'utilisation de .trim() pour supprimer les espace afin de ne pas creer une tâche avec
    //uniquement des espaces.
    if (newTaskName.trim()) {
      const newTask: Task = {
        //Nouvelle tâche qui suit notre interface.
        id: Date.now(), //Ajout de la dâte d'aujourdui comme id(timestamp).
        name: newTaskName, //Nom entré par l'utilisateur
        timeElapsed: 0, // On à commence à 0 seconde
        isRunning: false, //Le timer n'à pas encore démarré
      };

      //Ajout de la tâche a notre tableau.
      setTasks([...tasks, newTask]);
      //On vide le champ de saisie
      setNewTaskName("");
    }
  };

  //Fonction qui bascule le timer d'une tâche
  //_Création de la fonction toggle timer avec une arrow function.
  //Nous passons taskUid en paramètre avec un type number et un retour void car
  //la contion ne retourne rien.
  //
  const toggleTimer = (taskId: number) => {
    //SetTask pour réactualiser le tableau des tâches.
    //On utilise map pour parcourir le tableau et trouver la correspondance avec
    // le taskId en paramètre

    setTasks(
      tasks.map((task) =>
        //Si une correspondance est trouvé alors on utilise ...(opérateur spread)
        //pour créer in nouvel objet similaire au tableau task auquel on modifie la valeur isRunning.
        //pour l'inverser.
        task.id === taskId
          ? //Si le task id passé en argument est équivalent taskid de la de l'array mapé alors nous changons la
            //valeur isRunning pas son état inverse.SI elle était true elle devient false et vice et verca.
            { ...task, isRunning: !task.isRunning }
          : task
      )
    );
  };

  //Fonction qui supprime une tâche
  const deleteTask = (taskId: number) => {
    //Ici nous utilisons la fonction méthode filter qui permet de filtrer des éléments présent dans une array.
    //Cette méthode filtre l'éléments qui est différent de taskid des autres éléments de l'array et les copies dans une shallow copy qui est
    //ensuite passé a setTasks qui ré-actualise tasks avec cet version doté d'un élément en moins..
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  //Met a jour l'état des tâches en cours et
  //enregistre le temp depuis le démarrage de celle ci.
  useEffect(() => {
    //Creation d'un compteur avec setInterval.
    const interval = setInterval(() => {
      //On parcours task.
      //SI une task contient un élément isRunning: true alors
      //time elapsed est incrémenté de 1.
      //sinon la task est retourné tel quelle
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.isRunning ? { ...task, timeElapsed: task.timeElapsed + 1 } : task
        )
      );
    }, 1000); //1 maj par seconde
    //détruit le compteur interval pour éviter les fuites de mémoires.
    return () => clearInterval(interval);
  }, []);

  const formatTime = (second: number): string => {
    const hours = Math.floor(second / 3600);
    const minutes = Math.floor((second % 3600) / 60);
    const remainingSeconds = second % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  //Rendu du composant.
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Mon Timer de Tâches
      </h1>

      {/*Formulaire d'ajout de tâche*/}
      <div className="flex gap-4 mb-8  rounded p-4 shadow-xl">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Nom de la tâche"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 flex items-center gap-2"
        >
          Ajouter une tâche
        </button>
      </div>
      {/* Liste des tâches*/}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow-xl flex items-center justify-between"
          >
            <span className="font-medium flex-1">{task.name}</span>
            <span className="font-mono mx-4">
              {formatTime(task.timeElapsed)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTimer(task.id)}
                className={`p-2 rounded border-e-lime-400 p-4 border flex items-center hover:bg-green-400 text-black`}
              >
                {task.isRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 rounded bg-red-500 text-white"
              >
                Effacer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTimer;
